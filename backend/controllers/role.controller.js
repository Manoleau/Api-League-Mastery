const RoleModel = require("../models/role.model")
const RoleLanguageModel = require("../models/roleLanguage.model")
const LanguageModel = require("../models/language.model")

function isUrlOk(url) {
    try {
        new URL(url);
        return true; // La syntaxe de l'URL est correcte
    } catch (e) {
        return false; // L'URL est mal formée
    }
}
module.exports.getRoles = async (req, res) => {
    const language_code = req.query.language_code
    if (language_code) {
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code')
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }
            const roles = await RoleModel.find({}, 'image_icon')
            const roleTranslations = await RoleLanguageModel.find({ language: language._id }, 'name role').populate('role', 'image_icon');
            const translationsMap = roleTranslations.reduce((acc, curr) => {
                acc[curr.role._id.toString()] = curr.name;
                return acc;
            }, {});

            const rolesWithTranslation = roles.map(role => {
                return {
                    ...role.toJSON(),
                    translate_name: translationsMap[role._id.toString()] || "Pas de traduction",
                    language_code: language_code
                };
            });
            res.status(200).json(rolesWithTranslation);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    } else {
        const roles = await RoleModel.find({}, 'default_name image_icon')
        res.status(200).json(roles)
    }

}
module.exports.getRoleById = async (req, res) => {
    const id = req.params.id
    const language_code = req.query.language_code
    if (!id) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else if (language_code) {
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code')
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }
            const role = await RoleLanguageModel.findOne({
                language: language._id,
                role: id
            }, 'name role').populate('role', 'image_icon');
            if (!role) {
                return res.status(400).json({
                    message: `Le role id ${id} n'existe pas`
                })
            } else {

                const rolesWithTranslation = {
                    ...role.toJSON(),
                    translate_name: role.name,
                    language_code: language_code
                };
                res.status(200).json(rolesWithTranslation)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    } else {
        try {
            const role = await RoleModel.findById(id, 'default_name image_icon')
            if (role != null) {
                res.status(200).json(role)
            } else {
                res.status(400).json({
                    message: `Le role id ${id} n'existe pas`
                })
            }
        } catch (err) {
            res.status(400).json({
                message: `Le role id ${id} n'existe pas`
            })
        }

    }
}
module.exports.addRole = async (req, res) => {
    if (!req.body.default_name || !req.body.image_icon) {
        res.status(400).json({
            message: "données manquantes"
        })
    } else if (!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg"))) {
        res.status(400).json({
            message: "image_icon n'est pas une image valide"
        })
    } else {
        try {
            const role = await RoleModel.create({
                default_name: req.body.default_name,
                image_icon: req.body.image_icon
            })
            res.status(200).json(role)
        } catch (err) {
            console.log(err);
            if (err.toString().includes("MongoServerError")) {
                res.status(400).json({
                    message: "Vous avez tenté de mettre une valeur qui existe déjà. Role non enregistré"
                })
            } else {
                res.status(400).json({
                    message: "Une erreur est survenue"
                })
            }
        }
    }
}
module.exports.getChampions = async (req, res) => {

}
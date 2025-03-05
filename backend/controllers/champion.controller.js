const ChampionModel = require("../models/champion.model")
const RoleModel = require("../models/role.model")
const ChampionLanguageModel = require("../models/championLanguage.model")
const LanguageModel = require("../models/language.model")



function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}
function isUrlOk(url) {
    try {
        new URL(url);
        return true; // La syntaxe de l'URL est correcte
    } catch (e) {
        return false; // L'URL est mal formée
    }
}
module.exports.getChampionById = async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else if (req.query.language_code) {
        const language_code = req.query.language_code;
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code');
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }

            const championTranslation = await ChampionLanguageModel.findOne({
                language: language._id,
                champion: id
            }, 'name title champion ')
                .populate({
                    path: 'champion',
                    select: 'key name_id image_icon image_splash image_load_screen roles',
                    populate: {
                        path: 'roles',
                        select: '-createdAt -updatedAt -__v'
                    }
                });
            if (!championTranslation) {
                return res.status(400).json({
                    message: "Champion non trouvé"
                });
            }

            const { champion, name, title, ...rest } = championTranslation.toObject();
            const adjustedResponse = {
                _id: champion._id,
                name,
                title,
                language_code: language.code,
                ...champion,
                ...rest
            };

            res.status(200).json(adjustedResponse);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    } else {
        try {
            const champion = await ChampionModel.findById(id)
                .select('key default_name name_id default_title image_icon image_splash image_load_screen roles')
                .populate('roles', '-createdAt -__v -updatedAt');
            if (champion != null) {
                res.status(200).json(champion)
            } else {
                res.status(400).json({
                    message: `Le champion id ${id} n'existe pas`
                })
            }
        } catch (err) {
            res.status(400).json({
                message: `Le champion id ${id} n'existe pas`
            })
        }

    }

}
module.exports.getChampionByKey = async (req, res) => {
    const key = req.params.key;
    if (!key) {
        res.status(400).json({
            message: "paramètre manquant"
        });
    } else if (!isInt(key)) {
        res.status(400).json({
            message: "key n'est pas un entier"
        });
    } else if (req.query.language_code) {
        const language_code = req.query.language_code;
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code');
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }
            const championTMP = await ChampionModel.findOne({ key: Number(key) })
            if (!championTMP) {
                return res.status(400).json({
                    message: "Champion non trouvée"
                });
            }

            const championTranslation = await ChampionLanguageModel.findOne({
                language: language._id,
                champion: championTMP._id
            }, 'name title champion ')
                .populate({
                    path: 'champion',
                    select: 'key name_id image_icon image_splash image_load_screen roles',
                    populate: {
                        path: 'roles',
                        select: '-createdAt -updatedAt -__v'
                    }
                });
            if (!championTranslation) {
                return res.status(400).json({
                    message: "Champion non trouvé pour ce code de langue"
                });
            }

            const { champion, name, name_id, title, ...rest } = championTranslation.toObject();
            const adjustedResponse = {
                _id: champion._id,
                name,
                title,
                language_code: language.code,
                ...champion,
                ...rest
            };

            res.status(200).json(adjustedResponse);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    } else {
        const champion = await ChampionModel.findOne({ key: Number(key) })
            .select('key default_name name_id default_title image_icon image_splash image_load_screen roles')
            .populate('roles', '-createdAt -updatedAt -__v');

        if (champion) {
            res.status(200).json(champion);
        } else {
            res.status(400).json({
                message: `Le champion avec la clé ${key} n'existe pas`
            });
        }
    }
};
module.exports.getChampionByNameId = async (req, res) => {
    const name_id = req.params.name_id
    if (!name_id) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else if (req.query.language_code) {
        const language_code = req.query.language_code
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code');
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }
            const championTMP = await ChampionModel.findOne({ name_id: name_id })
            if (!championTMP) {
                return res.status(400).json({
                    message: "Champion non trouvée"
                });
            }

            const championTranslation = await ChampionLanguageModel.findOne({
                language: language._id,
                champion: championTMP._id
            }, 'name title champion ')
                .populate({
                    path: 'champion',
                    select: 'key name_id image_icon image_splash image_load_screen roles',
                    populate: {
                        path: 'roles',
                        select: '-createdAt -updatedAt -__v'
                    }
                });
            if (!championTranslation) {
                return res.status(400).json({
                    message: "Champion non trouvé pour ce code de langue"
                });
            }

            const { champion, name, title, ...rest } = championTranslation.toObject();
            const adjustedResponse = {
                _id: champion._id,
                name,
                title,
                language_code: language.code,
                ...champion,
                ...rest
            };

            res.status(200).json(adjustedResponse);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    } else {
        const champion = await ChampionModel.findOne({ name_id: name_id })
            .select('key default_name name_id default_title image_icon image_splash image_load_screen roles')
            .populate('roles', '-createdAt -__v -updatedAt');
        if (champion != null) {
            res.status(200).json(champion);
        } else {
            res.status(400).json({
                message: `Le champion ${name_id} n'existe pas`
            })
        }
    }
}
module.exports.getChampions = async (req, res) => {
    const language_code = req.query.language_code
    if (language_code) {
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code')
            if (!language) {
                return res.status(400).json({
                    message: "Langue non trouvée"
                });
            }
            const championTranslations = await ChampionLanguageModel.find({ language: language._id }, 'name title champion ')
                .populate({
                    path: 'champion',
                    select: 'key name_id image_icon image_splash image_load_screen roles',
                    populate: {
                        path: 'roles',
                        select: '-createdAt -updatedAt -__v'
                    }
                });
            const adjustedResponse = championTranslations.map(ct => {
                const { champion, name, title, _id, ...rest } = ct.toObject();
                return {
                    _id: champion._id,
                    name,
                    title,
                    language_code: language.code,
                    ...champion,
                    ...rest
                };
            });
            res.status(200).json(adjustedResponse);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    } else {
        const champions = await ChampionModel.find({})
            .select('key default_name name_id default_title image_icon image_splash image_load_screen roles')
            .populate('roles', '-createdAt -__v -updatedAt');
        res.status(200).json(champions)
    }

}

module.exports.getChampionsByRoleId = async (req, res) => {
    const roleId = req.params.role_id
    if (!roleId) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else{
        try{
            const champions = await ChampionModel.find({ roles: roleId }, '-createdAt -updatedAt -__v').populate('roles', '-createdAt -updatedAt -__v');
            res.status(200).json(champions)
        } catch (err){
            console.error(err);
            res.status(500).json({
                message:"Erreur"
            })
        }
        
    }
}

module.exports.addChampion = async (req, res) => {
    // console.log(!req.body.key && !req.body.default_name && !req.body.name_id && !req.body.image_icon && !req.body.image_splash && !req.body.image_load_screen && !req.body.default_title && !req.body.color);
    if (!req.body.key || !req.body.default_name || !req.body.name_id || !req.body.image_icon || !req.body.image_splash || !req.body.image_load_screen || !req.body.default_title) {
        res.status(400).json({
            message: "données manquantes"
        })
    } else if (!isInt(req.body.key)) {
        res.status(400).json({
            message: "key n'est pas un entier."
        })
    } else if (!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg"))) {
        res.status(400).json({
            message: "image_icon n'est pas une image valide"
        })
    } else if (!isUrlOk(req.body.image_splash) || (!req.body.image_splash.toLowerCase().includes("png") && !req.body.image_splash.toLowerCase().includes("jpg"))) {
        res.status(400).json({
            message: "image_splash n'est pas une image valide"
        })
    } else if (!isUrlOk(req.body.image_load_screen) || (!req.body.image_load_screen.toLowerCase().includes("png") && !req.body.image_load_screen.toLowerCase().includes("jpg"))) {
        res.status(400).json({
            message: "image_load_screen n'est pas une image valide"
        })
    } else {
        try {
            const champion = await ChampionModel.create({
                key: Number(req.body.key),
                default_name: req.body.default_name,
                name_id: req.body.name_id,
                default_title: req.body.default_title,
                image_icon: req.body.image_icon,
                image_splash: req.body.image_splash,
                image_load_screen: req.body.image_load_screen,
            })
            res.status(200).json(champion)
        } catch (err) {
            console.log(err);
            if (err.toString().includes("MongoServerError")) {
                res.status(400).json({
                    message: "Vous avez tenté de mettre une valeur qui existe déjà. Champion non enregistré"
                })
            } else {
                res.status(400).json({
                    message: "Une erreur est survenue"
                })
            }
        }
    }
}
module.exports.updateChampionById = async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else {
        try {
            const champion = await ChampionModel.findById(id)
            if (champion != null) {
                if (req.body.key && !isInt(req.body.key)) {
                    res.status(400).json({
                        message: `La key du champion n'est pas un entier`
                    })
                } else if (req.body.image_icon && (!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg")))) {
                    res.status(400).json({
                        message: "image_icon n'est pas une image valide"
                    })
                } else if (req.body.image_splash && (!isUrlOk(req.body.image_splash) || (!req.body.image_splash.toLowerCase().includes("png") && !req.body.image_splash.toLowerCase().includes("jpg")))) {
                    res.status(400).json({
                        message: "image_splash n'est pas une image valide"
                    })
                } else if (req.body.image_load_screen && (!isUrlOk(req.body.image_load_screen) || (!req.body.image_load_screen.toLowerCase().includes("png") && !req.body.image_load_screen.toLowerCase().includes("jpg")))) {
                    res.status(400).json({
                        message: "image_load_screen n'est pas une image valide"
                    })
                } else {
                    try {
                        const updateChampion = await ChampionModel.findByIdAndUpdate(
                            champion,
                            req.body,
                            { new: true }
                        )
                        res.status(200).json(updateChampion);
                    } catch (err) {
                        console.error(err);
                        res.status(400).json({
                            message: "Vous avez tenté de mettre une valeur qui existe déjà. Champion pas mise à jour"
                        })
                    }

                }
            } else {
                res.status(400).json({
                    message: `Le champion id ${id} n'existe pas`
                })
            }
        } catch (err) {
            res.status(400).json({
                message: `Le champion id ${id} n'existe pas`
            })
        }
    }
}
// module.exports.deleteChampionById = async (req, res) => {
//     const id = req.params.id;
//     if (!id) {
//         res.status(400).json({
//             message: "paramètre manquant"
//         })
//     } else {
//         try {
//             const test = await ChampionModel.deleteOne({ '_id': id })
//             res.status(200).json(test)
//         } catch (err) {
//             res.status(400).json({
//                 message: `Le champion id ${id} n'existe pas`
//             })
//         }
//     }
// }
// module.exports.deleteChampionByKey = async (req, res) => {
//     const key = req.params.key;
//     if (!key) {
//         res.status(400).json({
//             message: "paramètre manquant"
//         })
//     } else {
//         try {
//             const test = await ChampionModel.deleteOne({ 'key': key })
//             res.status(200).json(test)
//         } catch (err) {
//             res.status(400).json({
//                 message: `Le champion key ${key} n'existe pas`
//             })
//         }
//     }
// }
module.exports.addRole = async (req, res) => {
    if (!req.params.id || !req.body.role) {
        res.status(400).json({
            message: "paramètre manquant"
        })
    } else {
        try {
            const language = await RoleModel.findById(req.body.role);
            if (!language) {
                return res.status(400).send({ message: "Language pas trouvé" });
            }
        } catch (err) {
            return res.status(400).send({ message: "Language pas trouvé" })
        }
        try {
            const updateRole = await ChampionModel.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { roles: req.body.role } },
                { new: true }
            )
            res.status(200).json(updateRole)
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err })
        }
    }
}
module.exports.tkt = async (req, res) => {
    try {
        await ChampionLanguageModel.deleteMany({});
        await ChampionModel.deleteMany({});
        console.log('Collection vidée avec succès.');
    } catch (err) {
        console.log('Erreur lors de la suppression des documents:', err);
    }
}
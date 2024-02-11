const RoleLanguageModel = require("../models/roleLanguage.model")
const LanguageModel = require("../models/language.model")
const RoleModel = require("../models/role.model")

module.exports.addRoleLanguage = async (req,res) => {
    if(!req.body.name || !req.body.language_id || !req.body.role_id){
        res.status(400).json({ 
            message:"données manquantes"
        })
    } else {
        try{
            const language = await LanguageModel.findById(req.body.language_id);
            if (!language) {
                return res.status(400).send({ message: "Language pas trouvé" });
            }
        } catch(err){
            return res.status(400).send({ message: "Language pas trouvé" })
        }
        try {
            const role = await RoleModel.findById(req.body.role_id);
            if (!role) {
                return res.status(400).send({ message: "Role pas trouvé" });
            }
        } catch(err){
            return res.status(400).send({ message: "Role pas trouvé" });
        }
        try{
            const roleLanguage = await RoleLanguageModel.create({
                name : req.body.name,
                language : req.body.language_id,
                role : req.body.role_id
            })
            res.status(200).json(roleLanguage)
        } catch(err){
            console.log(err);
            if(err.toString().includes("MongoServerError")){
                res.status(400).json({
                    message:"Vous avez tenté de mettre une valeur qui existe déjà. RoleLanguage non enregistré"
                })
            } else {
                res.status(400).json({
                    message:"Une erreur est survenue"
                })
            }
        }
    }
    

}
module.exports.updateRoleLanguage = async (req, res) => {
    const {role_id, language_id} = req.params
    if(!role_id || !language_id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const language = await LanguageModel.findById(language_id);
            if (!language) {
                return res.status(400).send({ message: "Language pas trouvé" });
            }
        } catch(err){
            return res.status(400).send({ message: "Language pas trouvé" })
        }
        try {
            const role = await RoleModel.findById(role_id);
            if (!role) {
                return res.status(400).send({ message: "Role pas trouvé" });
            }
        } catch(err){
            return res.status(400).send({ message: "Role pas trouvé" });
        }
        if(!req.body.name){
            res.status(400).json({ 
                message:"paramètre manquant"
            })
        } else {
            try {
                const query = {language : language_id, role: role_id}
                const roleLanguageUpdate = await RoleLanguageModel.findOneAndUpdate(
                    query,
                    {name:req.body.name},
                    {new:true}
                )
                if(roleLanguageUpdate == null){
                    res.status(400).json({
                        message:"Ligne pas trouvé"
                    });
                } else {
                    res.status(200).json(roleLanguageUpdate);
                }
            } catch(err){
                console.error(err);
                res.status(400).json({ 
                    message:"Vous avez tenté de mettre une valeur qui existe déjà. Champion pas mise à jour"
                })
            }
        }
        
    }
}
module.exports.getRoleLanguage = async (req, res) => {
    
}
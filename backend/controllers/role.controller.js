const RoleModel = require("../models/role.model")

function isUrlOk(url) {
    try {
      new URL(url);
      return true; // La syntaxe de l'URL est correcte
    } catch (e) {
      return false; // L'URL est mal formée
    }
}
module.exports.getRoles = async (req,res) =>{
    const roles = await RoleModel.find({},'default_name image_icon')
    res.status(200).json(roles)
}
module.exports.getRoleById = async (req,res) => {
    const id = req.params.id
    if(!id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const role = await RoleModel.findById(id, 'default_name image_icon')
            if(role != null){
                res.status(200).json(role)
            } else {
                res.status(400).json({
                    message:`Le role id ${id} n'existe pas`
                })
            }
        } catch(err){
            res.status(400).json({
                message:`Le role id ${id} n'existe pas`
            })
        }
        
    }
}
module.exports.setRole = async (req,res) => {
    if(!req.body.default_name || !req.body.image_icon){
        res.status(400).json({ 
            message:"données manquantes"
        })
    } else if(!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg"))){
        res.status(400).json({ 
            message:"image_icon n'est pas une image valide"
        })
    } else {
        try {
            const role = await RoleModel.create({
                default_name: req.body.default_name,
                image_icon: req.body.image_icon
            })
            res.status(200).json(role)
        } catch(err){
            console.log(err);
            if(err.toString().includes("MongoServerError")){
                res.status(400).json({
                    message:"Vous avez tenté de mettre une valeur qui existe déjà. Role non enregistré"
                })
            } else {
                res.status(400).json({
                    message:"Une erreur est survenue"
                })
            }
        }
    }
}
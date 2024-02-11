const ChampionModel = require("../models/champion.model")

function isInt(str) {
    const num = Number(str);
    return Number.isInteger(num);
}
function isUrlOk(url) {
    try {
      new URL(url);
      return true; // La syntaxe de l'URL est correcte
    } catch (e) {
      return false; // L'URL est mal formée
    }
}
function isColorCodeOk(code) {
    // Cette regex vérifie si le code commence par un "#" suivi de 3, 4, 6, ou 8 caractères hexadécimaux
    const regex = /^#([0-9a-fA-F]{3}([0-9a-fA-F]{1})?|[0-9a-fA-F]{6}([0-9a-fA-F]{2})?)$/;
    return regex.test(code);
}

module.exports.getChampionById = async (req, res) =>{
    const id = req.params.id
    if(!id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const champion = await ChampionModel.findById(id, 'key default_name default_name_alt default_title image_icon image_splash image_load_screen color')
            if(champion != null){
                res.status(200).json(champion)
            } else {
                res.status(400).json({
                    message:`Le champion id ${id} n'existe pas`
                })
            }
        } catch(err){
            res.status(400).json({
                message:`Le champion id ${id} n'existe pas`
            })
        }
        
    }

}
module.exports.getChampionByKey = async (req, res) => {
    const key = req.params.key
    if(!key){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else if(!isInt(key)){
        res.status(400).json({ 
            message:"key n'est pas un entier"
        })
    } else {
        const champion = await ChampionModel.findOne({ key: Number(key) },'key default_name default_name_alt default_title image_icon image_splash image_load_screen color')
        if(champion != null){
            res.status(200).json(champion)
        } else {
            res.status(400).json({
                message:`Le champion key ${key} n'existe pas`
            })
        }
    }
    
}
module.exports.getChampionByDefaultName = async (req, res) => {
    const name = req.params.name
    if(!name){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        const champion = await ChampionModel.findOne({ default_name: name },'key default_name default_name_alt default_title image_icon image_splash image_load_screen color')
        if(champion != null){
            res.status(200).json(champion)
        } else {
            res.status(400).json({
                message:`Le champion ${name} n'existe pas`
            })
        }
    }
    
}
module.exports.getChampions = async (req, res) => {
    const champions = await ChampionModel.find({},'key default_name default_name_alt default_title image_icon image_splash image_load_screen color')
    res.status(200).json(champions)
}
module.exports.addChampion = async (req, res) => {
    // console.log(req.body);
    // console.log(!req.body.key && !req.body.default_name && !req.body.default_name_alt && !req.body.image_icon && !req.body.image_splash && !req.body.image_load_screen && !req.body.default_title && !req.body.color);
    if(!req.body.key || !req.body.default_name || !req.body.default_name_alt || !req.body.image_icon || !req.body.image_splash || !req.body.image_load_screen || !req.body.default_title || !req.body.color){
        res.status(400).json({ 
            message:"données manquantes"
        })
    } else if(!isInt(req.body.key)){
        res.status(400).json({ 
            message:"key n'est pas un entier."
        })
    } else if(!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg"))){
        res.status(400).json({ 
            message:"image_icon n'est pas une image valide"
        })
    } else if(!isUrlOk(req.body.image_splash) || (!req.body.image_splash.toLowerCase().includes("png") && !req.body.image_splash.toLowerCase().includes("jpg"))){
        res.status(400).json({ 
            message:"image_splash n'est pas une image valide"
        })
    } else if(!isUrlOk(req.body.image_load_screen) || (!req.body.image_load_screen.toLowerCase().includes("png") && !req.body.image_load_screen.toLowerCase().includes("jpg"))){
        res.status(400).json({ 
            message:"image_load_screen n'est pas une image valide"
        })
    } else if(req.body.color.length != 7 || !isColorCodeOk(req.body.color)){
        res.status(400).json({ 
            message:"color n'est pas une couleur valide"
        })
    } else {
        try{
            const champion = await ChampionModel.create({
                key : Number(req.body.key),
                default_name : req.body.default_name,
                default_name_alt : req.body.default_name_alt,
                default_title : req.body.default_title,
                image_icon : req.body.image_icon,
                image_splash : req.body.image_splash,
                image_load_screen : req.body.image_load_screen,
                color : req.body.color,
            })
            res.status(200).json(champion)
        } catch(err){
            console.log(err);
            if(err.toString().includes("MongoServerError")){
                res.status(400).json({
                    message:"Vous avez tenté de mettre une valeur qui existe déjà. Champion non enregistré"
                })
            } else {
                res.status(400).json({
                    message:"Une erreur est survenue"
                })
            }
        }
    }
}
module.exports.updateChampionById = async (req,res) =>{
    const id = req.params.id
    if(!id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const champion = await ChampionModel.findById(id)
            if(champion != null){
                if(req.body.key && !isInt(req.body.key)){
                    res.status(400).json({
                        message:`La key du champion n'est pas un entier`
                    })
                } else if (req.body.image_icon && (!isUrlOk(req.body.image_icon) || (!req.body.image_icon.toLowerCase().includes("png") && !req.body.image_icon.toLowerCase().includes("jpg")))){
                    res.status(400).json({ 
                        message:"image_icon n'est pas une image valide"
                    })
                } else if (req.body.image_splash && (!isUrlOk(req.body.image_splash) || (!req.body.image_splash.toLowerCase().includes("png") && !req.body.image_splash.toLowerCase().includes("jpg")))){
                    res.status(400).json({ 
                        message:"image_splash n'est pas une image valide"
                    })
                } else if(req.body.image_load_screen && (!isUrlOk(req.body.image_load_screen) || (!req.body.image_load_screen.toLowerCase().includes("png") && !req.body.image_load_screen.toLowerCase().includes("jpg")))){
                    res.status(400).json({ 
                        message:"image_load_screen n'est pas une image valide"
                    })
                } else if (req.body.color && (req.body.color.length != 7 || !isColorCodeOk(req.body.color))){
                    res.status(400).json({ 
                        message:"color n'est pas une couleur valide"
                    })
                } else {
                    try {
                        const updateChampion = await ChampionModel.findByIdAndUpdate(
                            champion,
                            req.body,
                            {new:true}
                        )
                        res.status(200).json(updateChampion);
                    } catch(err){
                        console.error(err);
                        res.status(400).json({ 
                            message:"Vous avez tenté de mettre une valeur qui existe déjà. Champion pas mise à jour"
                        })
                    }
                    
                }
            } else {
                res.status(400).json({
                    message:`Le champion id ${id} n'existe pas`
                })
            }
        } catch(err){
            res.status(400).json({
                message:`Le champion id ${id} n'existe pas`
            })
        }
    }
}
module.exports.deleteChampionById = async (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const test = await ChampionModel.deleteOne({'_id':id})
            res.status(200).json(test)
        } catch(err){
            res.status(400).json({
                message:`Le champion id ${id} n'existe pas`
            })
        }
    }
}
module.exports.deleteChampionByKey = async (req, res) => {
    const key = req.params.key;
    if(!key){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const test = await ChampionModel.deleteOne({'key':key})
            res.status(200).json(test)
        } catch(err){
            res.status(400).json({
                message:`Le champion key ${key} n'existe pas`
            })
        }
    }
}

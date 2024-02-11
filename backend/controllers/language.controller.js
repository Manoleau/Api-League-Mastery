const LanguageModel = require("../models/language.model")

module.exports.getLanguages = async (req, res) => {
    const languages = await LanguageModel.find({}, 'name code')
    res.status(200).json(languages)
}
module.exports.addLanguage = async (req, res) => {
    if(!req.body.name || !req.body.code){
        res.status(400).json({ 
            message:"données manquantes"
        })
    } else if(req.body.code.length != 5){
        res.status(400).json({ 
            message:"code pas valide"
        })
    } else {
        try {
            const language = await LanguageModel.create({
                name: req.body.name,
                code: req.body.code
            })
            res.status(200).json(language)
        } catch(err){
            console.log(err);
            if(err.toString().includes("MongoServerError")){
                res.status(400).json({
                    message:"Vous avez tenté de mettre une valeur qui existe déjà. Language non enregistré"
                })
            } else {
                res.status(400).json({
                    message:"Une erreur est survenue"
                })
            }
        }
    }
    
}
module.exports.getLanguageByCode = async (req,res) => {
    const code = req.params.code
    if(!code){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        const language = await LanguageModel.findOne({ code: code },'name code')
        if(language != null){
            res.status(200).json(language)
        } else {
            res.status(400).json({
                message:`Le language ${code} n'existe pas`
            })
        }
    }
}
module.exports.getLanguageById = async (req,res) => {
    const id = req.params.id
    if(!id){
        res.status(400).json({ 
            message:"paramètre manquant"
        })
    } else {
        try{
            const language = await LanguageModel.findById(id,'name code')
            if(language != null){
                res.status(200).json(language)
            } else {
                res.status(400).json({
                    message:`Le language ${id} n'existe pas`
                })
            }
        } catch(err){
            res.status(400).json({
                message:`Le language ${id} n'existe pas`
            })
        }
    }
}
const ChampionLanguageModel = require("../models/championLanguage.model")
const LanguageModel = require("../models/language.model")
const ChampionModel = require("../models/champion.model")

module.exports.addChampionLanguage = async (req, res) => {
    if (!req.body.name || !req.body.title || !req.body.language_id || !req.body.champion_id) {
        res.status(400).json({
            message: "données manquantes"
        })
    } else {
        try {
            const language = await LanguageModel.findById(req.body.language_id);
            if (!language) {
                return res.status(400).send({ message: "Language pas trouvé" });
            }
        } catch (err) {
            return res.status(400).send({ message: "Language pas trouvé" })
        }
        try {
            const champion = await ChampionModel.findById(req.body.champion_id);
            if (!champion) {
                return res.status(400).send({ message: "Champion pas trouvé" });
            }
        } catch (err) {
            return res.status(400).send({ message: "Champion pas trouvé" });
        }
        try {
            const championLanguage = await ChampionLanguageModel.create({
                name: req.body.name,
                title: req.body.title,
                language: req.body.language_id,
                champion: req.body.champion_id
            })
            res.status(200).json(championLanguage)
        } catch (err) {
            console.log(err);
            if (err.toString().includes("MongoServerError")) {
                res.status(400).json({
                    message: "Vous avez tenté de mettre une valeur qui existe déjà. ChampionLanguage non enregistré"
                })
            } else {
                res.status(400).json({
                    message: "Une erreur est survenue"
                })
            }
        }
    }
}
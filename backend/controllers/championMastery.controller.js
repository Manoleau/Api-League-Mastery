const SummonerModel = require("../models/summoner.model")
const ChampionMasteryModel = require("../models/championMastery.model")
const ChampionModel = require("../models/champion.model")
const ChampionLanguageModel = require("../models/championLanguage.model")

const servers = require("../config/servers.json")
const LanguageModel = require("../models/language.model")
function getServer(serverCode) {
    res = null
    let i = 0;
    while (res == null && i < servers.length) {
        if (servers[i].code == serverCode) {
            res = servers[i]
        }
        i++
    }
    return res
}
async function getChampionMasterys(puuid, serverCode) {
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    try {
        const response = await fetch(`https://${server.link}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.RIOT_API
            }
        });
        if (!response.ok) {
            return {
                message: "Summoner Introuvable",
                status: response.status
            };
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}

module.exports.addChampionMastery = async (req, res) => {
    const puuid = req.params.puuid
    if (!puuid) {
        res.status(400).json({
            message: "puuid du summoner manquant"
        })
    } else {
        const summoner = await SummonerModel.findOne({ puuid: puuid }, "-createdAt -updatedAt -__v")
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner Introuvable"
            })
        }
        try {
            const resultat = [];
            const champions = await getChampionMasterys(puuid, summoner.server)
            for (const champion of champions) {
                const championBD = await ChampionModel.findOne({ key: champion["championId"] }, "-createdAt -updatedAt -__v -roles")

                const championMastery = await ChampionMasteryModel.create({
                    championLevel: champion["championLevel"],
                    championPoints: champion["championPoints"],
                    championPointsSinceLastLevel: champion["championPointsSinceLastLevel"],
                    championPointsUntilNextLevel: champion["championPointsUntilNextLevel"],
                    chestGranted: champion["chestGranted"],
                    summoner: summoner,
                    champion: championBD,
                })
                const result = championMastery.toObject();
                delete result._id;
                delete result.__v;
                delete result.createdAt;
                delete result.updatedAt;
                resultat.push(result)
            }
            res.status(200).json(resultat)
        } catch (err) {
            if (err.toString().includes("MongoServerError")) {
                return res.status(400).json({
                    message: "Vous avez tenté de mettre une valeur qui existe déjà. Summoner non enregistré"
                })
            } else {
                return res.status(400).json({
                    message: "Une erreur est survenue"
                })
            }
        }
    }
}

module.exports.getChampionsMasteries = async (req, res) => {
    const puuid = req.params.puuid;
    const champId = req.query.champion_id;
    const language_code = req.query.language_code;
    if (!puuid) {
        req.status(400).json({
            message: "id du summoner manquant"
        })
    } else if (champId && language_code) {
        try {
            const language = await LanguageModel.findOne({ code: language_code }, 'name code');
            if (!language) {
                return res.status(400).json({ message: "Langue non trouvée" });
            }
            const champion = await ChampionModel.findOne({ "key": champId }, "-createdAt -updatedAt -__v");
            if (!champion) {
                return res.status(400).json({ message: "Champion non trouvé" });
            }
            const championTranslation = await ChampionLanguageModel.findOne({
                "champion": champion._id,
                "language": language._id
            }, "-createdAt -updatedAt -__v");

            if (!championTranslation) {
                return res.status(404).json({ message: "Traduction du champion non trouvée pour la langue spécifiée" });
            }

            const summoner = await SummonerModel.findOne({ "puuid": puuid }, "-createdAt -updatedAt -__v");
            if (!summoner) {
                return res.status(400).json({ message: "Summoner non trouvé" });
            }
            const championMastery = await ChampionMasteryModel.findOne({
                "summoner": summoner._id,
                "champion": champion._id
            }, "-createdAt -updatedAt -__v -_id")
                .populate({
                    path: 'champion',
                    select: '-createdAt -updatedAt -__v -roles -default_name -default_title',
                })
                .populate({
                    path: 'summoner',
                    select: '-createdAt -updatedAt -__v',
                });
            if (championMastery) {
                let response = championMastery.toObject(); // Convertir en objet JS pour manipulation
                response.champion.name = championTranslation.name; // Remplacer par nom traduit
                response.champion.title = championTranslation.title; // Remplacer par titre traduit
                response.champion.language_code = language_code
                res.status(200).json(response);
            } else {
                res.status(200).json({});
            }
        } catch (err) {
            res.status(400).json({ "message": "une erreur est survenue" });

        }

    } else if (language_code) {
        const language = await LanguageModel.findOne({ code: language_code }, 'name code');
        if (!language) {
            return res.status(400).json({ message: "Langue non trouvée" });
        }
        const championsTranslation = await ChampionLanguageModel.find({
            "language": language._id
        }, "-createdAt -updatedAt -__v");
        const summoner = await SummonerModel.findOne({ "puuid": puuid }, "-createdAt -updatedAt -__v");
        if (!summoner) {
            return res.status(400).json({ message: "Summoner non trouvé" });
        }
        const championsMastery = await ChampionMasteryModel.find({
            "summoner": summoner._id,
        }, "-createdAt -updatedAt -__v -_id")
            .populate({
                path: 'champion',
                select: '-createdAt -updatedAt -__v -roles -default_name -default_title',
            })
            .populate({
                path: 'summoner',
                select: '-createdAt -updatedAt -__v',
            });
        if (championsMastery.length > 0) {
            for (let i = 0; i < championsMastery.length; i++) {
                let j = i;
                while (championsMastery[i].champion._id.toString() !== championsTranslation[j].champion.toString()) {
                    j++;
                }
                const response = championsMastery[i].toObject();
                response.champion.name = championsTranslation[j].name;
                response.champion.title = championsTranslation[j].title;
                response.champion.language_code = language_code
                championsMastery[i] = response
            }
            for (let i = 0; i < championsMastery.length; i++) {
                if (championsMastery[i].champion.name == null) {
                    console.log("GGEZ");
                }
            }
            res.status(200).json(championsMastery)
        } else {
            res.status(200).json({});
        }
    } else if (champId) {
        const summoner = await SummonerModel.findOne(
            { "puuid": puuid },
            "-createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        const champion = await ChampionModel.findOne(
            { "key": champId },
            "-createdAt -updatedAt -__v"
        )
        if (!champion) {
            return res.status(400).json({
                message: "Champion non trouvé"
            });
        }
        const championM = await ChampionMasteryModel
            .findOne({ "summoner": summoner._id, "champion": champion._id }, "-createdAt -updatedAt -__v -_id")
            .populate("champion", " -createdAt -updatedAt -__v -roles")
            .populate("summoner", " -createdAt -updatedAt -__v -roles")

        if (championM) {
            res.status(200).json(championM)
        } else {
            res.status(200).json({})
        }
    } else {
        const summoner = await SummonerModel.findOne(
            { "puuid": puuid },
            "-createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        const champions = await ChampionMasteryModel
            .find({ "summoner": summoner._id }, " -createdAt -updatedAt -__v -_id")
            .populate("champion", " -createdAt -updatedAt -__v -roles")
            .populate("summoner", "-createdAt -updatedAt -__v")
        // const response = {
        //     summoner: {
        //         "summonerId": summoner.summonerId,
        //         "accountId": summoner.accountId,
        //         "puuid": summoner.puuid,
        //         "server": summoner.server,
        //         "summonerName": summoner.summonerName,
        //         "riotName": summoner.riotName,
        //         "tag": summoner.tag,
        //         "profileIconId": summoner.profileIconId,
        //         "summonerLevel": summoner.summonerLevel
        //     },
        //     champions:champions
        // };
        res.status(200).json(champions)
    }
}


module.exports.editChampionMastery = async (req, res) => {
    const puuid = req.params.puuid
    if (!puuid) {
        res.status(400).json({
            message: "puuid du summoner manquant"
        })
    } else {
        const summoner = await SummonerModel.findOne({ puuid: puuid }, "-createdAt -updatedAt -__v")
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner Introuvable"
            })
        }
        try {
            const resultat = [];
            const champions = await getChampionMasterys(puuid, summoner.server)
            for (const champion of champions) {
                const championBD = await ChampionModel.findOne({ key: champion["championId"] }, "-createdAt -updatedAt -__v -roles")
                const championMastery = await ChampionMasteryModel.find(
                    { "summoner": summoner._id, "champion": championBD._id },
                    "-createdAt -updatedAt -__v"
                )
                const updateChampionMastery = await ChampionMasteryModel.findByIdAndUpdate(
                    championMastery,
                    {
                        championLevel: champion["championLevel"],
                        championPoints: champion["championPoints"],
                        championPointsSinceLastLevel: champion["championPointsSinceLastLevel"],
                        championPointsUntilNextLevel: champion["championPointsUntilNextLevel"],
                        chestGranted: champion["chestGranted"],
                    },
                    { new: true }
                )
                const result = updateChampionMastery.toObject();
                delete result._id;
                delete result.__v;
                delete result.createdAt;
                delete result.updatedAt;
                delete result.summoner;
                delete result.champion;
                resultat.push(result)
            }
            res.status(200).json(resultat)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Une erreur est survenue" })
        }
    }
}

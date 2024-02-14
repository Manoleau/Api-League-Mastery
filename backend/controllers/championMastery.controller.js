const SummonerModel = require("../models/summoner.model")
const ChampionMasteryModel = require("../models/championMastery.model")
const ChampionModel = require("../models/champion.model")
const servers = require("../config/servers.json")
async function getChampionMasterys(puuid, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = servers[serverCode]
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
        const summoner = await SummonerModel.findOne({puuid: puuid})
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner Introuvable"
            })
        }
        try {
            const resultat = [];
            const champions = await getChampionMasterys(puuid, summoner.server)
            for (const champion of champions) {
                const championBD = await ChampionModel.findOne({key: champion["championId"]})

                const championMastery = await ChampionMasteryModel.create({
                    championLevel: champion["championLevel"],
                    championPoints: champion["championPoints"],
                    championPointsSinceLastLevel: champion["championPointsSinceLastLevel"],
                    championPointsUntilNextLevel: champion["championPointsUntilNextLevel"],
                    chestGranted: champion["chestGranted"],
                    summoner: summoner,
                    champion: championBD,
                })
                resultat.push(championMastery)
            }
            res.status(200).json(resultat)
        } catch (err) {
            console.log(err);
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
    if(!puuid){
        req.status(400).json({
            message:"id du summoner manquant"
        })
    } else if(champId){
        const summoner = await SummonerModel.findOne(
            {"puuid":puuid},
            "-createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        const champion = await ChampionModel.findOne(
            {"key":champId},
            "-createdAt -updatedAt -__v"
        )
        if (!champion) {
            return res.status(400).json({
                message: "Champion non trouvé"
            });
        }
        const championM = await ChampionMasteryModel
            .findOne({"summoner":summoner._id, "champion":champion._id},"-createdAt -updatedAt -__v -_id")
            .populate("champion", "-_id -createdAt -updatedAt -__v -roles")
            .populate("summoner","-_id -createdAt -updatedAt -__v -roles")

        if(championM){
            res.status(200).json(championM)
        } else {
            res.status(200).json({})
        }
    } else{
        const summoner = await SummonerModel.findOne(
            {"puuid":puuid},
            "-createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        const champions = await ChampionMasteryModel
            .find({"summoner":summoner._id}, "-_id -createdAt -updatedAt -__v -summoner")
            .populate("champion", "-_id -createdAt -updatedAt -__v -roles")
        const response = {
            summoner: {
                "summonerId": summoner.summonerId,
                "accountId": summoner.accountId,
                "puuid": summoner.puuid,
                "server": summoner.server,
                "summonerName": summoner.summonerName,
                "riotName": summoner.riotName,
                "tag": summoner.tag,
                "profileIconId": summoner.profileIconId,
                "summonerLevel": summoner.summonerLevel
            },
            champions:champions
        };
        res.status(200).json(response)
    }
}

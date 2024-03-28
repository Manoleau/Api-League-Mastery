const SummonerModel = require("../models/summoner.model")
const servers = require("../config/servers.json")
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
async function getSummById(summonerId, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    try {
        const response = await fetch(`https://${server.link}/lol/summoner/v4/summoners/${summonerId}`, {
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

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}
async function getSummByName(summonerName, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    try {
        const response = await fetch(`https://${server.link}/lol/summoner/v4/summoners/by-name/${summonerName}`, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.RIOT_API
            }
        });

        if (!response.ok) {
            console.log(response);
            return {
                message: "Summoner Introuvable",
                status: response.status
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}
async function getSummByPuuid(puuid, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    try {
        const response = await fetch(`https://${server.link}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.RIOT_API
            }
        });

        if (!response.ok) {
            console.log(response);
            return {
                message: "Summoner Introuvable",
                status: response.status
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}
async function getRiotAccByPuuid(puuid, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    try {
        const response = await fetch(`https://${server.region.link}/riot/account/v1/accounts/by-puuid/${puuid}`, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.RIOT_API
            }
        });

        if (!response.ok) {
            return {
                message: "Compte Riot Introuvable",
                status: response.status
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}
async function getRiotAccByNameTag(name, tag, serverCode) {
    // Utilise import() pour charger dynamiquement node-fetch
    const fetch = await import('node-fetch').then(({ default: fetch }) => fetch);
    const server = getServer(serverCode)
    console.log(server);
    try {
        const response = await fetch(`https://${server.region.link}/riot/account/v1/accounts/by-riot-id/${name}/${tag}`, {
            method: 'GET',
            headers: {
                'X-Riot-Token': process.env.RIOT_API
            }
        });

        if (!response.ok) {
            return {
                message: "Compte Riot Introuvable",
                status: response.status
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return {
            message: error.message || "Une erreur est survenue"
        };
    }
}

module.exports.addSummonerBySummId = async (req, res) => {
    if (!req.body.summoner_id) {
        res.status(400).json({
            message: "id du summoner manquant"
        })
    } else if (!req.query.server) {
        res.status(400).json({
            message: "server en query manquant"
        })
    } else {
        const summoner = await getSummById(req.body.summoner_id, req.query.server)
        if (summoner.id) {
            const riotAcc = await getRiotAccByPuuid(summoner.puuid, req.query.server)
            summoner["riotName"] = riotAcc.gameName
            summoner["tag"] = riotAcc.tagLine
            try {
                const summonerM = await SummonerModel.create({
                    summonerId: summoner.id,
                    accountId: summoner.accountId,
                    puuid: summoner.puuid,
                    summonerName: summoner.name,
                    riotName: summoner.riotName,
                    tag: summoner.tag,
                    server: req.query.server,
                    profileIconId: Number(summoner.profileIconId),
                    summonerLevel: Number(summoner.summonerLevel)
                })
                return res.status(200).json(summonerM)
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
        } else {
            return res.status(400).json(summoner)
        }

    }
}
module.exports.addSummonerBySummName = async (req, res) => {
    if (!req.body.summoner_name) {
        res.status(400).json({
            message: "nom du summoner manquant"
        })
    } else if (!req.query.server) {
        res.status(400).json({
            message: "server en query manquant"
        })
    } else {
        const summoner = await getSummByName(req.body.summoner_name, req.query.server)
        if (summoner.id) {
            const riotAcc = await getRiotAccByPuuid(summoner.puuid, req.query.server)
            summoner["riotName"] = riotAcc.gameName
            summoner["tag"] = riotAcc.tagLine
            try {
                const summonerM = await SummonerModel.create({
                    summonerId: summoner.id,
                    accountId: summoner.accountId,
                    puuid: summoner.puuid,
                    summonerName: summoner.name,
                    riotName: summoner.riotName,
                    tag: summoner.tag,
                    server: req.query.server,
                    profileIconId: Number(summoner.profileIconId),
                    summonerLevel: Number(summoner.summonerLevel)
                })
                return res.status(200).json(summonerM)
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
        } else {
            return res.status(400).json(summoner)
        }

    }
}
module.exports.addSummonerByRiotAcc = async (req, res) => {
    if (!req.body.name || !req.body.tag) {
        res.status(400).json({
            message: "données manquantes"
        })
    } else if (!req.query.server) {
        res.status(400).json({
            message: "server en query manquant"
        })
    } else {
        const riotAcc = await getRiotAccByNameTag(req.body.name, req.body.tag, req.query.server)
        if (riotAcc.puuid) {
            const summoner = await getSummByPuuid(riotAcc.puuid, req.query.server)
            summoner["riotName"] = riotAcc.gameName
            summoner["tag"] = riotAcc.tagLine
            try {
                const summonerM = await SummonerModel.create({
                    summonerId: summoner.id,
                    accountId: summoner.accountId,
                    puuid: summoner.puuid,
                    summonerName: summoner.name,
                    riotName: summoner.riotName,
                    tag: summoner.tag,
                    server: req.query.server,
                    profileIconId: Number(summoner.profileIconId),
                    summonerLevel: Number(summoner.summonerLevel)
                })
                return res.status(200).json(summonerM)
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
        } else {
            return res.status(400).json(summoner)
        }

    }
}

module.exports.getSummonerBySummId = async (req, res) => {
    const summId = req.params.summoner_id;
    if (!summId) {
        req.status(400).json({
            message: "id du summoner manquant"
        })
    } else {
        const summoner = await SummonerModel.findOne(
            { "summonerId": summId },
            " -createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        res.status(200).json(summoner)
    }
}
module.exports.getSummonerBySummName = async (req, res) => {
    const summName = req.params.summoner_name;
    if (!summName) {
        req.status(400).json({
            message: "nom du summoner manquant"
        })
    } else {
        const summoner = await SummonerModel.findOne(
            { "summonerName": summName },
            " -createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return res.status(400).json({
                message: "Summoner non trouvé"
            });
        }
        res.status(200).json(summoner)
    }
}
module.exports.getSummonerByRiot = async (req, res) => {
    const name = req.params.name;
    const tag = req.params.tag
    if (!name || !tag) {
        req.status(400).json({
            message: "données manquantes"
        })
    } else {
        var summoner = await SummonerModel.findOne(
            {
                "riotName": name,
                "tag": tag
            },
            " -createdAt -updatedAt -__v"
        )
        if (!summoner) {
            var riotAcc = await getRiotAccByNameTag(name, tag, "EUW1")
            var i = 1;
            while (i < servers.length && !riotAcc.puuid) {
                riotAcc = await getRiotAccByNameTag(name, tag, servers[i]);
                i++;
            }
            if (riotAcc.puuid) {
                summoner = await getSummByPuuid(riotAcc.puuid, servers[i - 1].code)
                summoner["riotName"] = riotAcc.gameName
                summoner["tag"] = riotAcc.tagLine
                try {
                    const summonerM = await SummonerModel.create({
                        summonerId: summoner.id,
                        accountId: summoner.accountId,
                        puuid: summoner.puuid,
                        summonerName: summoner.name,
                        riotName: summoner.riotName,
                        tag: summoner.tag,
                        server: servers[i - 1].code,
                        profileIconId: Number(summoner.profileIconId),
                        summonerLevel: Number(summoner.summonerLevel)
                    })
                    return res.status(200).json(summonerM)
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
            } else {
                return res.status(400).json({
                    message: "Summoner non trouvé"
                });
            }
        }
        res.status(200).json(summoner)
    }
}
module.exports.getSummonerByPuuid = async (req, res) => {
    const puuid = req.params.puuid;
    if (!puuid) {
        req.status(400).json({
            message: "données manquantes"
        })
    } else {
        var summoner = await SummonerModel.findOne(
            {
                "puuid": puuid,
            },
            " -createdAt -updatedAt -__v"
        )
        if (!summoner) {
            var riotAcc = await getRiotAccByPuuid(puuid, "EUW1")
            var i = 1;
            while (i < servers.length && !riotAcc.puuid) {
                riotAcc = await getRiotAccByPuuid(puuid, servers[i]);
                i++;
            }
            if (riotAcc.puuid) {
                summoner = await getSummByPuuid(riotAcc.puuid, servers[i - 1].code)
                summoner["riotName"] = riotAcc.gameName
                summoner["tag"] = riotAcc.tagLine
                try {
                    const summonerM = await SummonerModel.create({
                        summonerId: summoner.id,
                        accountId: summoner.accountId,
                        puuid: summoner.puuid,
                        summonerName: summoner.name,
                        riotName: summoner.riotName,
                        tag: summoner.tag,
                        server: servers[i - 1].code,
                        profileIconId: Number(summoner.profileIconId),
                        summonerLevel: Number(summoner.summonerLevel)
                    })
                    return res.status(200).json(summonerM)
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
            } else {
                return res.status(400).json({
                    message: "Summoner non trouvé"
                });
            }
        }
        res.status(200).json(summoner)
    }
}


module.exports.editSummoner = async (req, res) => {
    const puuid = req.params.puuid
    if (!puuid) {
        return req.status(400).json({
            message: "données manquantes"
        })
    } else {
        const summoner = await SummonerModel.findOne(
            { "puuid": puuid },
            " -createdAt -updatedAt -__v"
        )
        if (!summoner) {
            return req.status(400).json({
                message: "Summoner inexistant"
            })
        }
        const newSummoner = await getSummByPuuid(puuid, summoner.server)
        const riotAcc = await getRiotAccByPuuid(puuid, summoner.server)
        const result = newSummoner.toObject();
        console.log(result);
        const updateSummoner = await SummonerModel.findByIdAndUpdate(
            summoner,
            result,
            { new: true }
        )
        res.status(200).json(updateSummoner)
    }
}
//  || !req.body.accountId || !req.body.puuid || !req.body.summonerName || !req.body.riotName || !req.body.tag || !req.body.profileIconId || !req.body.summonerLevel




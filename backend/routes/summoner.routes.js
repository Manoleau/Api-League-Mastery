const express = require('express');
const { addSummonerBySummId, addSummonerBySummName, addSummonerByRiotAcc, getSummonerBySummId, getSummonerBySummName,
    getSummonerByRiot
} = require('../controllers/summoner.controller');
const {addChampionMastery, getChampionsMasteries} = require("../controllers/championMastery.controller");
const router = express.Router();


router.post("/add/by_id", addSummonerBySummId)
router.post("/add/by_name", addSummonerBySummName)
router.post("/add/by_riot", addSummonerByRiotAcc)
router.post("/add/champions_masteries/:puuid", addChampionMastery);

router.get("/by_name/:summoner_name", getSummonerBySummName)
router.get("/by_summid/:summoner_id", getSummonerBySummId)
router.get("/by_riot/:name/:tag", getSummonerByRiot)
router.get("/champions/:puuid", getChampionsMasteries)
module.exports = router;
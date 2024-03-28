const express = require('express');
const { getSummonerBySummId, getSummonerBySummName, getSummonerByRiot, getSummonerByPuuid } = require('../controllers/summoner.controller');
const { getChampionsMasteries } = require("../controllers/championMastery.controller");
const router = express.Router();


router.get("/by_name/:summoner_name", getSummonerBySummName)
router.get("/by_summid/:summoner_id", getSummonerBySummId)
router.get("/by_riot/:name/:tag", getSummonerByRiot)
router.get("/by_puuid/:puuid", getSummonerByPuuid)

router.get("/champions/:puuid", getChampionsMasteries)
module.exports = router;
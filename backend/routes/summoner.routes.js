const express = require('express');
const { addSummonerBySummId, addSummonerBySummName, addSummonerByRiotAcc, getSummonerBySummId, getSummonerBySummName,
    getSummonerByRiot
} = require('../controllers/summoner.controller');
const router = express.Router();

router.get("/ggez", (req, res) => {
    res.status(200).json({
        "message": "ggez"
    })
})

router.post("/add/by_id", addSummonerBySummId)
router.post("/add/by_name", addSummonerBySummName)
router.post("/add/by_riot", addSummonerByRiotAcc)

router.get("/by_name/:summoner_name", getSummonerBySummName)
router.get("/by_summid/:summoner_id", getSummonerBySummId)
router.get("/by_riot/:name/:tag", getSummonerByRiot)
module.exports = router;
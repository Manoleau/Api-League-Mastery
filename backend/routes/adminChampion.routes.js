const express = require('express');
const { addChampion, updateChampionById, addRole } = require('../controllers/champion.controller');
const { addChampionLanguage } = require('../controllers/championLanguage.controller');
const {addChampionMastery, editChampionMastery} = require("../controllers/championMastery.controller");
const router = express.Router();


// POST
router.post("/", addChampion);
router.post("/addLanguage/", addChampionLanguage)
router.post("/addchampionsmasteries/:puuid", addChampionMastery);
// PUT
router.put("/:id", updateChampionById);
router.put("/championsmasteries/:puuid", editChampionMastery);

//PATCH
router.patch("/:id", addRole);



// router.delete("/by_id/:id", deleteChampionById)
// router.delete("/by_key/:key", deleteChampionByKey)
// router.delete("/tkt", tkt)

module.exports = router;
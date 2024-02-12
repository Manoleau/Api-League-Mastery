const express = require('express');
const { addChampion, getChampions, getChampionById, getChampionByKey, getChampionByDefaultName, updateChampionById, deleteChampionById, deleteChampionByKey, addRole } = require('../controllers/champion.controller');
const router = express.Router();

// GET
router.get("/", getChampions);
router.get("/by_id/:id", getChampionById);
router.get("/by_key/:key", getChampionByKey);
router.get("/by_default_name/:name", getChampionByDefaultName)

// POST
router.post("/", addChampion);

// PUT
router.put("/:id", updateChampionById)

//PATCH
router.patch("/:id", addRole)

// router.delete("/by_id/:id", deleteChampionById)
// router.delete("/by_key/:key", deleteChampionByKey)
// router.delete("/tkt", tkt)


module.exports = router;
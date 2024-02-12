const express = require('express');
const { getChampions, getChampionById, getChampionByKey, getChampionByNameId, getChampionsByRoleId } = require('../controllers/champion.controller');
const router = express.Router();

// GET
router.get("/", getChampions);
router.get("/by_id/:id", getChampionById);
router.get("/by_key/:key", getChampionByKey);
router.get("/by_name_id/:name_id", getChampionByNameId);
router.get("/by_role_id/:role_id", getChampionsByRoleId)

module.exports = router;
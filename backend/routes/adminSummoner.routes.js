const express = require('express');
const { editSummoner } = require('../controllers/summoner.controller');
const router = express.Router();


// POST

// PUT
router.put("/:puuid", editSummoner)

module.exports = router;
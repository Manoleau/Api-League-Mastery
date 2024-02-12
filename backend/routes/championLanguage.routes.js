const express = require('express');
const { addChampionLanguage } = require('../controllers/championLanguage.controller');
// require('../controllers/championLanguage.controller')
const router = express.Router();

router.post("/", addChampionLanguage)
module.exports = router;
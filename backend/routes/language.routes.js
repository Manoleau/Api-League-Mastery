const express = require('express');
const { getLanguages, getLanguageByCode, getLanguageById } = require('../controllers/language.controller');
// require('../controllers/language.controller')
const router = express.Router();

//GET
router.get("/", getLanguages);
router.get("/by_code/:code", getLanguageByCode);
router.get("/by_id/:id", getLanguageById)


module.exports = router;
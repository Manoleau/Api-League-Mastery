const express = require('express');
const { addLanguage } = require('../controllers/language.controller');
const router = express.Router();


router.post("/", addLanguage);

module.exports = router;
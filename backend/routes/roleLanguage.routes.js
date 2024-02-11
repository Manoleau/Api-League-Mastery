const express = require('express');
const { addRoleLanguage, updateRoleLanguage } = require('../controllers/roleLanguage.controller');
// require('../controllers/roleLanguage.controller')
const router = express.Router();

router.post("/", addRoleLanguage)

router.put("/:role_id/:language_id", updateRoleLanguage)

module.exports = router;
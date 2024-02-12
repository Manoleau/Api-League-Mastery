const express = require('express');
const { addRoleLanguage, updateRoleLanguage } = require('../controllers/roleLanguage.controller');
const { addRole } = require('../controllers/role.controller');

const router = express.Router();

router.post("/", addRole)

router.post("/", addRoleLanguage)

router.put("/role_id/:role_id/language_id/:language_id", updateRoleLanguage)

module.exports = router;
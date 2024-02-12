const express = require('express');
const { addRoleLanguage, updateRoleLanguage } = require('../controllers/roleLanguage.controller');
// require('../controllers/roleLanguage.controller')
const router = express.Router();

// GET
// router.get("/",getRolesLanguages)
// router.get("/roles_languages/:role_id/:language_id")
// router.get("/languages/:language_id")
// router.get("/roles/:role_id")


// POST
router.post("/", addRoleLanguage)

router.put("/role_id/:role_id/language_id/:language_id", updateRoleLanguage)

module.exports = router;
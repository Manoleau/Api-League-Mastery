const express = require('express');
const { getRoles, getRoleById, addRole, getRolesByLanguage } = require('../controllers/role.controller');
// require('../controllers/role.controller');
const router = express.Router();

// GET
router.get("/",getRoles);
router.get("/by_id/:id", getRoleById)

router.get("/by_language_code/:language_code", getRolesByLanguage)

// POST
router.post("/", addRole)

module.exports = router;
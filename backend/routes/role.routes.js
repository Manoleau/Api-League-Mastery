const express = require('express');
const { getRoles, getRoleById, setRole } = require('../controllers/role.controller');
// require('../controllers/role.controller');
const router = express.Router();

// GET
router.get("/",getRoles);
router.get("/by_id/:id", getRoleById)

// POST
router.post("/", setRole)

module.exports = router;
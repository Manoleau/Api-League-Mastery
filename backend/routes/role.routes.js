const express = require('express');
const { getRoles, getRoleById } = require('../controllers/role.controller');
const router = express.Router();

// GET
router.get("/", getRoles);
router.get("/by_id/:id", getRoleById)

module.exports = router;
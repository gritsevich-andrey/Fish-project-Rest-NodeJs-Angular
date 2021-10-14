const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth')

router.post('/login', controller.login);

// http://localhost:5000/api/auth/register
router.post('/register', controller.register);

router.get('/users', controller.getAll);

module.exports = router

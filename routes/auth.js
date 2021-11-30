const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth')

// http://localhost:5000/api/auth
const authenticate = passport.authenticate('jwt', {session: false});
router.post('/login', controller.login);
router.patch('/update', controller.login);
router.post('/register', controller.register);
router.post('/restore-password', controller.restorePassword);
router.get('/users', authenticate, controller.getAll);

module.exports = router

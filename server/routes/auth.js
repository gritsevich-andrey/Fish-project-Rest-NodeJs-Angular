const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth')

// http://localhost:5000/api/auth/register
const authenticate = passport.authenticate('jwt', {session: false});
router.post('/login', controller.login);
router.post('/register', controller.register);

router.get('/users', authenticate, controller.getAll);

module.exports = router

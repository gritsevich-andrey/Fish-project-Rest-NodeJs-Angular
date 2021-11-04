const express = require('express');
const passport = require('passport');
const controller = require('../controllers/cabinet');
const router = express.Router();


// http://localhost:5000/chat
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/');
router.get('/:email',authenticate, controller.getByEmail);

module.exports = router

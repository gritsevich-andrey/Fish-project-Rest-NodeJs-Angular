const express = require('express');
const passport = require('passport');
const controller = require('../controllers/chat');
const router = express.Router();


// http://localhost:5000/chat
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/', authenticate, controller.getAll);
router.post('/', authenticate, controller.create);
router.get('/:email', authenticate, controller.getByEmail);
module.exports = router

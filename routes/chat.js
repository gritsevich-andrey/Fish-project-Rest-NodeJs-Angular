const express = require('express');
const passport = require('passport');
const controller = require('../controllers/chat');
const router = express.Router();


// http://localhost:5000/chat
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:email', controller.getByEmail);
module.exports = router

const express = require('express');
const passport = require('passport');
const controller = require('../controllers/comments');
const router = express.Router();


// http://localhost:5000/api/comments
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:id', authenticate, controller.getComments);
router.post('/', authenticate, controller.createComment);
router.patch('/', authenticate, controller.deleteComment);

module.exports = router

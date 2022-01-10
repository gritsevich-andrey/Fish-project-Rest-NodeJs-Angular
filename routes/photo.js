const express = require('express');
const controller = require('../controllers/photo');
const passport = require('passport');
const router = express.Router();
const upload = require('../middleware/upload');

// http://localhost:5000/api/photo
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:userEmail', authenticate, controller.getPhotoByUserEmail);
router.get('/', authenticate, controller.getAllPhoto);
router.get('/:id', authenticate, controller.getPhotoById);
router.post('/', authenticate, upload.single('image'), controller.create);
router.patch('/increment-likes', authenticate, controller.incrementLikes);
router.patch('/decrement-likes', authenticate, controller.decrementLikes);
router.patch('/set-comment', authenticate, controller.setComment);
router.patch('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
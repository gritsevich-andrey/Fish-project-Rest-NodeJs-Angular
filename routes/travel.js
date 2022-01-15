const express = require('express');
const controller = require('../controllers/travel');
const passport = require('passport');
const upload = require("../middleware/upload");
const router = express.Router();

// http://localhost:5000/api/travels
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:userEmail', authenticate, controller.getTravelByUserEmail);
router.get('/', authenticate, controller.getAllTravels);
router.get('/get-travel/:id', authenticate, controller.getTravelById);
router.post('/', authenticate, upload.single('image'), controller.create);
router.patch('/update/:id', authenticate, upload.single('image'), controller.update);
router.delete('/:id', authenticate, controller.remove);
router.patch('/join', authenticate, controller.join)
router.patch('/change-user-status', authenticate, controller.changeUserStatus)
router.patch('/update-user-comment', authenticate, controller.updateUserComment)
router.patch('/change-travel-status', authenticate, controller.changeTravelStatus)
router.patch('/leave', authenticate, controller.leave)

module.exports = router;

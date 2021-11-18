const express = require('express');
const controller = require('../controllers/travel');
const passport = require('passport');
const router = express.Router();

// http://localhost:5000/api/travels
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:userEmail', authenticate, controller.getTravelByUserEmail);
router.get('/', authenticate, controller.getAllTravels);
router.get('/:id', authenticate, controller.getTravelById);
router.post('/', authenticate, controller.create);
router.patch('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
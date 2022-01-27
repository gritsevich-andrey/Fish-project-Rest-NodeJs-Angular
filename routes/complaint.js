const express = require('express');
const controller = require('../controllers/complaint');
const passport = require("passport");
const router = express.Router();


// http://localhost:5000/api/complaint
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:email', authenticate, controller.getByEmail);
// router.post('/' , authenticate, controller.createComplaint);
router.patch('/', authenticate, controller.updateComplaint)
router.delete('/:email/:id', authenticate, controller.deleteByEmail)
router.post('/' , controller.createOCR);
module.exports = router

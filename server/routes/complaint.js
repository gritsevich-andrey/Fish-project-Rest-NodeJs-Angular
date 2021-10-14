const express = require('express');
const controller = require('../controllers/complaint');
const passport = require("passport");
const router = express.Router();



// http://localhost:5000/api/complaint
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:id'/*, authenticate*/ , controller.getAll);
router.post('/'/*, authenticate*/ , controller.createComplaint);

module.exports = router
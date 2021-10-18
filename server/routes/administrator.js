const express = require('express');
const controller = require('../controllers/administrator');
const passport = require("passport");
const router = express.Router();


// http://localhost:5000/api/administator
/*const authenticate = passport.authenticate('jwt', {session: false});*/;
router.get('/', /*authenticate,*/ controller.getAll);
router.post('/ban', /*authenticate,*/ controller.banById);
router.post('/unban', /*authenticate,*/ controller.unBanById);

module.exports = router
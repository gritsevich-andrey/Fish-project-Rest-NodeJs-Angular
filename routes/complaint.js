const express = require('express');
const controller = require('../controllers/complaint');
const passport = require("passport");
const router = express.Router();
const upload = require('../middleware/upload');


// http://localhost:5000/api/complaint
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/:email', authenticate, controller.getByEmail);
router.post('/',  upload.single('file'), controller.createComplaint);
router.patch('/', authenticate, controller.updateComplaint)
router.delete('/:email/:id', authenticate, controller.deleteByEmail)
// router.post('/', controller.createOCR);
module.exports = router

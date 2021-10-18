const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/cabinet');
const router = express.Router();



// http://localhost:5000/api/cabinet
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/',authenticate , controller.getAll);
router.get('/:id', controller.getByEmail);
router.delete('/:id', authenticate, controller.remove);
router.post('/', upload.single('image'), controller.create);
router.patch('/:id', authenticate, upload.single('image'), controller.update);

module.exports = router

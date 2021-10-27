const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/cabinet');
const router = express.Router();


// http://localhost:5000/api/cabinet
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/',authenticate , controller.getAll);
router.get('/:email',authenticate, controller.getByEmail);
router.post('/fio',authenticate,controller.getFIO)
router.delete('/:id', authenticate, controller.remove);
router.post('/', upload.single('image'), controller.create);
router.patch('/', upload.single('image'), controller.update);

module.exports = router

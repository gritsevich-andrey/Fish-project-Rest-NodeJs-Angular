const express = require('express');
const router = express.Router();
const controller = require('../controllers/cabinet')


// http://localhost:5000/api/cabinet
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.remove);
router.post('/', controller.create);
router.post('/:id', controller.update);

module.exports = router

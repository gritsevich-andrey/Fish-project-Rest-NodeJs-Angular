const express = require('express');
const controller = require('../controllers/complaint');
const router = express.Router();


// http://localhost:5000/api/complaint
router.get('/:id', controller.getAllById);
router.post('/', controller.createComplaint);

module.exports = router
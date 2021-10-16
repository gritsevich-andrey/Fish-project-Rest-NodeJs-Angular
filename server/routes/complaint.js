const express = require('express');
const controller = require('../controllers/complaint');
const router = express.Router();


// http://localhost:5000/api/complaint
router.get('/:email', controller.getByEmail);
router.post('/', controller.createComplaint);
router.delete('/', controller.deleteByEmail)

module.exports = router
const express = require('express');
const controller = require('../controllers/administrator');
const router = express.Router();


// http://localhost:5000/api/administator
router.get('/', controller.getAll);
router.post('/ban', controller.banById);
router.post('/unban', controller.unBanById);

module.exports = router
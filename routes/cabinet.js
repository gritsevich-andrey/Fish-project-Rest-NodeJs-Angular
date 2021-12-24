const express = require('express');
const passport = require('passport');
const upload = require('../middleware/upload');
const controller = require('../controllers/cabinet');
const router = express.Router();


// http://localhost:5000/api/cabinet
const authenticate = passport.authenticate('jwt', {session: false});
router.get('/get-cabinets-with-reviews', authenticate, controller.getCabinetsWithReviews);
router.get('/get-user-reviews/:email', authenticate, controller.getUserReviews);
router.get('/', authenticate, controller.getAll);
router.get('/:email', authenticate, controller.getByEmail);
router.post('/fio', authenticate, controller.getFIO)
router.delete('/:id', authenticate, controller.remove);
router.patch('/update-review-shown', authenticate, controller.updateReviewShown)
router.post('/', authenticate, upload.single('image'), controller.create);
router.patch('/', authenticate, upload.single('image'), controller.update);
router.patch('/update/:email', authenticate, controller.updateReview);
router.patch('/rating/:email', controller.updateRating);
router.get('/rating/:travelId/:email', controller.getRating);
module.exports = router

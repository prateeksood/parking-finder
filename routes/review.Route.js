const router=require('express').Router();
const auth=require('../middleware/auth');
const reviewController=require('../controllers/review.Controller');

router.post('/:id',auth,reviewController.createReview)

router.get('/:id',reviewController.getReviewsByParkingId)

router.delete('/:id',auth,reviewController.deleteReview);

module.exports=router;
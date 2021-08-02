const reviewDao=require('../dao/review.Dao')

const createReviewService=async (data,callBack)=>{
    const{parkingId,reviewHead,reviewBody,rating,authorId,authorName}=data;

    try{
        let insertedReview= await reviewDao.createReview(parkingId,reviewHead,reviewBody,rating,authorId,authorName);
        if(!insertedReview||insertedReview.length<1){
            return callBack("Review not created", 200);
        }
        else{

            let result={
                message: "Review Successfully Created",
                review:{...data,id:insertedReview.insertId}
            }
            return callBack(null, 200 , result);
        } 

    }catch(err){

        return callBack(err.message, 500);
    } 
}

const getReviewsByParkingIdService=async (data,callBack)=>{
    const{id}=data;
    try{
        let foundReviews= await reviewDao.getReviewsByParkingId(id);
        if(!foundReviews||foundReviews.length<1){
            return callBack("No reviews found", 200);
        }
        else{
            let result={
                message: "Reviews successfully found",
                review:foundReviews
            }
            return callBack(null, 200 , result);
        } 

    }catch(err){

        return callBack(err.message, 500);
    } 
}

const deleteReviewService=async (data,callBack)=>{
    const{id}=data;
    try{
        let deletedReview= await reviewDao.deleteReview(id);
        if(!deletedReview||deletedReview.length<1){
            return callBack("Unable to delete review", 200);
        }
        else{
            let result={
                message: "Reviews successfully deleted",
                review:deletedReview
            }
            return callBack(null, 200 , result);
        } 

    }catch(err){
        return callBack(err.message, 500);
    } 
}

module.exports={createReviewService,getReviewsByParkingIdService,deleteReviewService}
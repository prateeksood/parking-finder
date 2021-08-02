const db=require("../db")


const createReview= async (parkingId,reviewHead,reviewBody,rating,authorId,authorName)=>{
    let query=`INSERT INTO reviews (reviewHead,reviewBody,rating,parkingId,authorId,authorName) VALUES ("${reviewHead}","${reviewBody}",${rating},${parkingId},${authorId},"${authorName}")`;
    try{
        let createdReviews=await db.query(query);
        return createdReviews;
    }catch(err){
        console.log(err)
        throw Error(`Error while creating reviews : ${err.message}`);
    }
}

const getReviewsByParkingId=async(id)=>{
    query=`SELECT * FROM reviews where parkingId in (${id})`;
    try{
        let foundReviews=await db.query(query);
        return foundReviews;
    }catch(err){
        throw Error(`Error while finding reviews : ${err.message}`);
    }
}

const deleteReview=async(id)=>{
    let query=`DELETE FROM reviews WHERE id=${id}`;
    try{
        let deletedReviews = await db.query(query);
        return deletedReviews;
    }catch(err){
        throw Error(`Error while deleting reviews : ${err.message}`);
    }
}

module.exports = {getReviewsByParkingId,createReview,deleteReview}
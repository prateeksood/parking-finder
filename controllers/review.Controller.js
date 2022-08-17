const reviewService=require('../services/review.Service')

const createReview=(req,res)=>{
    data=req.body.review;
    data.parkingId=req.params.id;
    try{
        reviewService.createReviewService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const getReviewsByParkingId=(req,res)=>{
    data=req.params;
    try{
        reviewService.getReviewsByParkingIdService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const deleteReview=(req,res)=>{
    data=req.params;
    try{
        reviewService.deleteReviewService(data,(err, status, result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}
module.exports={createReview,getReviewsByParkingId,deleteReview};
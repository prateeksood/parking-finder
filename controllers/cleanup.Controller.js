const cleanupService=require("../services/cleanup.Service");

const deleteUnpaidOrders=(req,res)=>{
    try{
        cleanupService.deleteUnpaidOrder((err,status,result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        });

    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const updateInactiveOrders=(req,res)=>{
    try{
        cleanupService.markInactiveOrders((err,status,result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        });

    }catch(err){
        return res.status(500).json({error:err.message})
    }
}



module.exports={deleteUnpaidOrders,updateInactiveOrders}
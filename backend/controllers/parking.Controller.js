const parkingService=require("../services/parking.Service");

const getAllParkings = (req,res)=>{
    try{
        parkingService.getAllParkingsService((err, status, result)=>{
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

const getParkingsByParkingId = (req,res)=>{
    let data=req.params;
    try{
        parkingService.getParkingsByParkingIdService(data,(err, status, result)=>{
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

const getParkingsByUserId = (req,res)=>{
    let data=req.params;
    try{
        parkingService.getParkingsByUserIdService(data,(err, status, result)=>{
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

const createParking = (req,res)=>{
    let data=req.body;
    try{
        if(req.user){
            parkingService.createParkingService(data,(err, status, result)=>{
                if(!err){
                    return res.status(status).json({error:null,result})
                }
                else{
                    return res.status(status).json({error:err})
                }
            })
        }
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const updateParking=(req,res)=>{
    let data=req.body;
    data.id=req.params.id;
    try{
         parkingService.updateParkingService(data,(err, status, result)=>{
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

const disableParking=(req,res)=>{
    data=req.params;
    try{
        parkingService.disableParkingService(data,(err, status, result)=>{
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

module.exports={getAllParkings,getParkingsByParkingId,getParkingsByUserId,createParking,updateParking,disableParking};
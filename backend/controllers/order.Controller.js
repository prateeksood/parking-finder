const orderService=require("../services/order.Service");

const getAllOrders = (req,res)=>{
    try{
        orderService.getAllOrdersService((err, status, result)=>{
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

const findOrdersByUserId=(req,res)=>{
    let data=req.params;
    try{
        orderService.findOrdersByUserIdService(data,(err,status,result)=>{
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

const findOrdersByParkingId=(req,res)=>{
    let data=req.params;
    try{
        orderService.findOrdersByParkingIdService(data,(err,status,result)=>{
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

const findActiveOrdersByParkingId=(req,res)=>{
    let data=req.params;
    try{
        orderService.findActiveOrdersByParkingIdService(data,(err,status,result)=>{
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

const findOrdersByOrderId=(req,res)=>{
    let data=req.params;
    try{
        orderService.findOrdersByOrderIdService(data,(err,status,result)=>{
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

const createOrder=(req,res)=>{
    let data=req.body;
    if(req.user){

        try{
            orderService.createOrderService(data,(err,status,result)=>{
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
}

const confirmOrder=(req,res)=>{
    let data=req.body;
    try{
        orderService.confirmOrderService(data,(err,status,result)=>{
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

module.exports={getAllOrders,findOrdersByUserId,findOrdersByParkingId,findActiveOrdersByParkingId,findOrdersByOrderId,createOrder,confirmOrder}
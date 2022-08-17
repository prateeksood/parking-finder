const authService=require("../services/auth.Service")

const findUser = async (req,res)=>{
    let data=req.user||req.params
    try{
        await authService.findUserService(data,(err,status,result)=>{
            if(!err){
                res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        });
    }catch(err){
        return res.status(400).json({error:err.message})
    }
    
}

module.exports={findUser};
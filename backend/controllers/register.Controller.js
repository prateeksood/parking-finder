const registerService = require("../services/register.Service")

const registerUser = async (req, res)=>{
    let data=req.body;
    try{
        registerService.registerUserService(data,(err, status, result)=>{
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

module.exports={registerUser};
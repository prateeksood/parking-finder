const loginService=require("../services/login.Service")

const loginUser = async (req,res)=>{

    const data=req.body;
    try{
        loginService.loginUserService(data,(err,status,result)=>{
            if(!err){
                return res.status(status).json({error:null,result})
            }
            else{
                return res.status(status).json({error:err})
            }
        })
    }catch(err){
        return res.status(400).json({error:err.message})
    }
}

module.exports={loginUser}
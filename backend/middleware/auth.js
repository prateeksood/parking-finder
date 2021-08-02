const jwt=require('jsonwebtoken');

const auth=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token) res.status(401).json({error:'Token not found, access denied'})
    else{
        try{
            const decode=jwt.verify(token,"my_jwt_secret_123")
            req.user=decode;
            next();
        }catch(err){
            res.status(400).json({error:err.message})
        }
    }
    
}
module.exports=auth;
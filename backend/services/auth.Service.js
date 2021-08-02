const authDao=require("../dao/auth.Dao")

const findUserService= async(data,callBack)=>{
    try{
        let foundUser=await authDao.findUser(data.id);
        if(foundUser.length>0){
            let result={
                user:foundUser[0]
            }
            return callBack(null,200,result)
        }
        else{
            return callBack('Invalid User Id', 401)
        }
        
    }catch(err){
        return callBack(err.message, 500);
    }
    
}
module.exports={findUserService}
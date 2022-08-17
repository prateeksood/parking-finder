const authDao=require("../dao/register.Dao")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");


const registerUserService = async (data, callBack)=>{
    const { name, email, password, contactNumber } = data;
    let hashRounds=10;
    let tokenExpireTime=31536000;

    try{
        let foundUser = await authDao.checkIfAlreadyRegistered(email);
        if (foundUser.length===0) { 
            const hashedPassword = await bcrypt.hash(password, hashRounds)
            let savedUser = await authDao.saveUser(name,email,hashedPassword,contactNumber);
            jwt.sign({ id: savedUser.id },"my_jwt_secret_123",{ expiresIn: tokenExpireTime},(err, token) => {
                if (err) {return callBack(err, 400)}
                let result={
                    message: "Account successfully created",
                    token,
                    user: {
                        fullname: name,
                        email: email,
                        contactNumber: contactNumber,
                        id: savedUser.insertId
                    }
                }
                return callBack(null, 200 , result);
            });
            
        }
        else {
            return callBack('Email Address already in use', 200)
        } 
    }catch(err){
        return callBack(err.message, 500)
    }
    

}
module.exports={registerUserService};
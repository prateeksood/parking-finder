const loginDao = require("../dao/login.Dao")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");

const loginUserService = async (data,callBack)=>{

    const { email, password } = data;

    const foundUser=await loginDao.findUser(email);

    if (foundUser.length>0) {
        bcrypt
        .compare(password, foundUser[0].password)
        .then(isMatched => {
            if (isMatched) {
                jwt.sign({ id: foundUser[0].id }, "my_jwt_secret_123",{ expiresIn: 31536000 },(err, token) => {
                    
                    if (err) {return callBack(err, 400)};

                   let result={
                        message: "Login successful",
                        token,
                        user: {
                            fullname: foundUser[0].fullname,
                            email: foundUser[0].email,
                            contactNumber: foundUser[0].contactNumber,
                            id: foundUser[0].id,
                            isAdmin:foundUser[0].isAdmin
                        }
                    };
                    return callBack(null, 200 , result);
                });
            } 
            else {
                return callBack('Invalid Password', 200)
            }
        })
        .catch(err =>
        {return callBack(err.message, 500)}
        );
    } 
    else {
        return callBack('Invalid Email Address', 200)
    }
    }

module.exports = {loginUserService};
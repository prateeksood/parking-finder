const db = require("../db");

const findUser= async (email)=>{

    let query=`SELECT * FROM users WHERE email="${email}" LIMIT 1`;
    try{

        let foundUser = await db.query(query);
        return foundUser;

    }catch(err){
        throw Error(`Error while finding User : ${err.message}`);
    }
    
}

module.exports = {findUser}
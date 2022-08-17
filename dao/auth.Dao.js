const db=require("../db")

const findUser=async (id)=>{
    try{
        let query=`SELECT * FROM users WHERE id=${id}`;
        let foundUser=await db.query(query)
        return foundUser;
    }catch(err){
        throw Error(`Error while finding User : ${err.message}`);
    }
}
module.exports={findUser};
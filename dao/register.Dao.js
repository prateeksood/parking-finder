const db=require('../db');

const checkIfAlreadyRegistered = async (email)=>{
    let query=`SELECT * FROM users WHERE email="${email}"`;
    try{
        let foundUser= await db.query(query);
        return foundUser;
    }catch(err){
        throw Error(`Error while finding User : ${err.message}`);
    }
}
const saveUser = async (name,email,hash,contactNumber)=>{
    query=`INSERT INTO users (fullname,email,password,contactNumber) VALUES ("${name}","${email}","${hash}",${contactNumber})`;
    try{
        let savedUser= await db.query(query);
        return savedUser;
    }catch(err){
        throw Error(`Error while creating new user : ${err.message}`);
    }
}

module.exports={checkIfAlreadyRegistered, saveUser}
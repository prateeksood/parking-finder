const db = require('../db')


const getImagesByParkingId=async(id)=>{
    query=`SELECT * FROM images where parkingId in (${id})`;
    try{
        let foundImages=await db.query(query);
        return foundImages;
    }catch(err){
        throw Error(`Error while finding Images : ${err.message}`);
    }
}

const insertImage=async(image,parkingId)=>{
    query=`INSERT INTO images(parkingId,url) values(${parkingId},"${image}")`;
    try{
        let foundImages=await db.query(query);
        return foundImages;
    }catch(err){
        throw Error(`Error while inserting Images : ${err.message}`);
    }
}

module.exports={getImagesByParkingId,insertImage}
const db=require('../db');

const selectAllParkings=async ()=>{
    let query="SELECT * FROM parkingDetails";
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        throw Error(`Error while finding Parking : ${err.message}`);
    }
}

const getParkingsByParkingId=async (id)=>{
    let query=`SELECT * FROM parkingDetails where id in (${id})`;
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        throw Error(`Error while finding Parking : ${err.message}`);
    }
}

const getParkingsByUserId=async (id)=>{
    let query=`SELECT * FROM parkingDetails where ownerId in (${id}) AND isActive=1 ORDER BY id`;
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        throw Error(`Error while finding Parking : ${err.message}`);
    }
}
const createParking=async(title,location,totalSpots,cost,owner)=>{
    let query=`INSERT INTO parkingdetails (title,lat,lon,city,totalSpots,cost,ownerId) values ( "${title}",${location.lat},${location.lng},"${location.placeName}",${totalSpots},${cost},${owner})`;
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        throw Error(`Error while creating Parking : ${err.message}`);
    }
}
const updateParking=async(id,title,location,totalSpots,cost)=>{
    let query=`UPDATE parkingdetails SET title="${title}",lat=${location.lat},lon=${location.lng},city="${location.placeName}",totalSpots=${totalSpots},cost=${cost} WHERE id=${id};`;
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        console.log(err);
        throw Error(`Error while updating Parking : ${err.message}`);
    }
}
const disableParking=async(id)=>{
    let query=`UPDATE parkingdetails SET isActive=0 WHERE id=${id};`;;
    try{
        let foundParkings=await db.query(query);
        return foundParkings;
    }catch(err){
        console.log(err);
        throw Error(`Error while updating Parking : ${err.message}`);
    }
    
}

module.exports={selectAllParkings,getParkingsByParkingId,getParkingsByUserId,createParking,updateParking,disableParking};
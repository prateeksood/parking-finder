const parkingDao=require("../dao/parking.Dao")
const imagesDao=require("../dao/images.Dao")
const reviewsDao=require("../dao/review.Dao")


const getAllParkingsService= async (callBack)=>{

    let finalParkings=[];
    try{
        let foundParkings= await parkingDao.selectAllParkings();
        if(!foundParkings||foundParkings.length<1){
            let result={
                message: "No parkings found",
                parkings: []
            }
            return callBack(null, 200 , result);
        }
        else{
            foundParkings.forEach(async (parking)=>{
                let images=await imagesDao.getImagesByParkingId(parking.id);
                parking={...parking,images};

                let reviews= await reviewsDao.getReviewsByParkingId(parking.id);
                parking={...parking,reviews};

                finalParkings.push(parking);

                if(finalParkings.length===foundParkings.length){
                    let result={
                        message: "parkings Successfully fetched",
                        parkings: finalParkings
                    }
                    return callBack(null, 200 , result);
                }
            })  
        } 

    }catch(err){

        return callBack(err.message, 500);
    }   

}

const getParkingsByParkingIdService= async (data,callBack)=>{

    const {id}=data;
    try{
        let parking = await parkingDao.getParkingsByParkingId(id)

        if(!parking||parking.length===0){
            let result={
                message: "No parkings found",
                parking
            }
            return callBack(null, 200 , result);
        }
        
        let images=await imagesDao.getImagesByParkingId(parking[0].id);
        parking={...parking[0],images};

        let reviews=await reviewsDao.getReviewsByParkingId(parking.id)
        parking={...parking,reviews};

        let result={
            message: "parking Successfully fetched",
            parking
        }
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err.message, 500);
    }   

}

const getParkingsByUserIdService = async (data,callBack)=>{

    const {id}=data;
    let finalParkings=[];
    try{
        let parkings = await parkingDao.getParkingsByUserId(id)

        if(!parkings||parkings.length===0){
            let result={
                message: "No parkings found",
                parkings:[]
            }
            return callBack(null, 200 , result);
        }
        
        parkings.forEach(async (parking)=>{
            let images=await imagesDao.getImagesByParkingId(parking.id);
            parking={...parking,images};

            let reviews= await reviewsDao.getReviewsByParkingId(parking.id);
            parking={...parking,reviews};

            finalParkings.push(parking);

            if(finalParkings.length===parkings.length){
                let result={
                    message: "parkings Successfully fetched",
                    parkings: finalParkings
                }
                return callBack(null, 200 , result);
            }
        })
    }catch(err){
        return callBack(err.message, 500);
    }
}

const createParkingService = async (data,callBack)=>{

    const {title,location,totalSpots,cost,owner,images}=data;
    try{
        let savedParking=await parkingDao.createParking(title,location,totalSpots,cost,owner);
        images.forEach( async (image) => {
            let savedImages= await imagesDao.insertImage(image,savedParking.insertId)
        });
        let result={
            message: "parking Successfully Created",
            parking:savedParking
        }
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err.message, 500);
    }
}

const updateParkingService = async (data,callBack)=>{

    const{id,title,location,totalSpots,cost}=data;
    try{
        let updatedParking=await parkingDao.updateParking(id,title,location,totalSpots,cost);
        let result={
            message: "parking Successfully Updated",
            parking:updatedParking
        }
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err.message, 500);
    }
}

const disableParkingService=async(data,callBack)=>{
    const {id}=data;
    try{
        let disabledParking=await parkingDao.disableParking(id);
        let result={
            message: "parking Successfully Disabled",
            parking:disabledParking
        }
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err.message, 500);
    }
}

module.exports = {getAllParkingsService, getParkingsByParkingIdService,getParkingsByUserIdService,createParkingService,updateParkingService,disableParkingService}
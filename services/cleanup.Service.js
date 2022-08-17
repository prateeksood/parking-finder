const cleanupDao=require("../dao/cleanup.Dao")

const deleteUnpaidOrder= async (callBack)=>{
    try{
        let deletedOrders= await cleanupDao.deleteUnpaidOrder();
        let result={
            message: "Unpaid orders successfully deleted",
            orders:deletedOrders
        }  
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err,500)
    }
}

const markInactiveOrders= async (callBack)=>{
    
    try{
        let updatedOrders=await cleanupDao.updateInactiveOrders();
        let result={
            message: "Inactive orders successfully updated",
            orders:updatedOrders
        }  
        return callBack(null, 200 , result);
    }catch(err){
        return callBack(err,500);
    }
}

module.exports={deleteUnpaidOrder,markInactiveOrders}
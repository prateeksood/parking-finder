db=require('../db');

const deleteUnpaidOrder=async ()=>{
    let query=`DELETE FROM orders WHERE isPaid IN (0)`;
    try{
       let deletedOrders= await db.query(query);
       return deletedOrders;
    }catch(err){
        throw Error(`Error while deleteting unpaid orders : ${err.message}`);
    }
}

const updateInactiveOrders= async ()=>{

    let query=`UPDATE orders SET isActive=0 WHERE bookingTime < (UNIX_TIMESTAMP(CURRENT_TIMESTAMP) - UNIX_TIMESTAMP(orders.date))/3600`;
    try{
        let updatedOrders= await db.query(query);
        return updatedOrders;
    }catch(err){
        throw Error(`Error while updating inactive orders : ${err.message}`);
    }
}

module.exports={deleteUnpaidOrder,updateInactiveOrders};
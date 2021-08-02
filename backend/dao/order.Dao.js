const db=require('../db');

const selectAllOrders=async ()=>{
    let query=`SELECT * FROM parking.orders WHERE isPaid IN (1) ORDER BY date DESC`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while finding Orders : ${err.message}`);
    }
}

const findOrdersByUserId=async (id)=>{
    let query=`SELECT * FROM orders WHERE tenantId IN (${id}) AND isPaid IN (1)  ORDER BY date DESC`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while finding Orders : ${err.message}`);
    }
}

const findOrdersByParkingId=async (id)=>{
    let query=`SELECT * FROM orders WHERE parkingId IN (${id}) AND isPaid IN (1)  ORDER BY date DESC`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while finding Orders : ${err.message}`);
    }
}

const findActiveOrdersByParkingId=async (id)=>{
    let query=`SELECT * FROM orders WHERE parkingId IN (${id}) AND isPaid IN (1) AND isActive IN (1)  ORDER BY date DESC`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while finding Orders : ${err.message}`);
    }
}

const findOrdersByOrderId=async (id)=>{
    let query=`SELECT * FROM orders WHERE id IN ('${id}')`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while finding Orders : ${err.message}`);
    }
}

const createOrder=async (id,tenant,parking,bookingTime,bookingSpots,total)=>{
    let query=`INSERT INTO orders (id,tenantId,parkingId,bookingTime,bookingSpots,totalCost) values ('${id}',${tenant},${parking},${bookingTime},${bookingSpots},${total})`;
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while creatingOrder : ${err.message}`);
    }
}

const confirmOrder=async (orderId,paymentId)=>{
    let query=`UPDATE orders SET isPaid=1,paymentId='${paymentId}' WHERE id='${orderId}';`
    try{
        let foundOrders=await db.query(query);
        return foundOrders;
    }catch(err){
        throw Error(`Error while confirming Order : ${err.message}`);
    }
}
const fetchOwner=async(ownerId)=>{
    let query=`SELECT * FROM users  WHERE id='${ownerId}';`
    try{
        let foundUser=await db.query(query);
        return foundUser;
    }catch(err){
        throw Error(`Error while finding User: ${err.message}`);
    }
}
module.exports={selectAllOrders,findOrdersByUserId,findOrdersByParkingId,findActiveOrdersByParkingId,findOrdersByOrderId,createOrder,confirmOrder,fetchOwner}
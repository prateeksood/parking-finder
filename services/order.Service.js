const orderDao=require("../dao/order.Dao")
const nodemailer = require("nodemailer");
const Razorpay=require('razorpay')
require('dotenv').config();
const getAllOrdersService= async (callBack)=>{

    try{
        let foundOrders= await orderDao.selectAllOrders();
        if(!foundOrders||foundOrders.length<1){
            let result={
                message: "No orders found",
                orders: []
            }
            return callBack(null, 200 , result);
        }
        else{
            let result={
                message: "Orders Successfully fetched",
                orders: foundOrders
            }
            return callBack(null, 200 , result);
        } 

    }catch(err){

        return callBack(err.message, 500);
    }   

}
const findOrdersByUserIdService= async (data,callBack)=>{
    
    let {id}=data;
    try{
        let foundOrders=await orderDao.findOrdersByUserId(id);
        if(!foundOrders||foundOrders.length<1){
            let result={
                message: "No orders found",
                orders: []
            }
            return callBack(null, 200 , result);
        }
        else{
            let result={
                message: "Orders Successfully fetched",
                orders: foundOrders
            }
            return callBack(null, 200 , result);
        } 
    }catch(err){
        return callBack(err.message, 500);
    }
    
}
const findOrdersByParkingIdService= async (data,callBack)=>{
    
    let {id}=data;
    try{
        let foundOrders=await orderDao.findOrdersByParkingId(id);
        if(!foundOrders||foundOrders.length<1){
            let result={
                message: "No orders fetched",
                orders: []
            }
            return callBack(null, 200 , result);
        }
        else{
            let result={
                message: "Orders Successfully fetched",
                orders: foundOrders
            }
            return callBack(null, 200 , result);
        } 
    }catch(err){
        return callBack(err.message, 500);
    }
    
}
const findActiveOrdersByParkingIdService= async (data,callBack)=>{
    
    let {id}=data;
    try{
        let foundOrders=await orderDao.findActiveOrdersByParkingId(id);
        if(!foundOrders||foundOrders.length<1){
            let result={
                message: "No orders fetched",
                orders: []
            }
            return callBack(null, 200 , result);
        }
        else{
            let result={
                message: "Orders Successfully fetched",
                orders: foundOrders
            }
            return callBack(null, 200 , result);
        } 
    }catch(err){
        return callBack(err.message, 500);
    }
    
}
const findOrdersByOrderIdService= async (data,callBack)=>{
    
    let {id}=data;
    try{
        let foundOrders=await orderDao.findOrdersByOrderId(id);
        if(!foundOrders||foundOrders.length<1){
            let result={
                message: "No orders fetched",
                orders: []
            }
            return callBack(null, 200 , result);
        }
        else{
            let result={
                message: "Orders Successfully fetched",
                orders: foundOrders
            }
            return callBack(null, 200 , result);
        } 
    }catch(err){
        return callBack(err.message, 500);
    }
    
}
const createOrderService= async (data,callBack)=>{
    const {tenant,parking,bookingTime,bookingSpots,total}=data;
        let instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
            headers: {
                "X-Razorpay-Account": "C3E1jV2MAaFjz8"
            }
        });
        instance.orders.create(
            {
                "amount":total*100,
                "currency":"INR",
                "receipt":"Receipt #20",
                "notes":[],
            }
        )
        .then(async (response)=>{
            let createdOrder=  await orderDao.createOrder(response.id,tenant,parking,bookingTime,bookingSpots,total)
            
            if(!createdOrder||createdOrder.length<1){
                return callBack("Unable to create order", 400 , result); 
            }
            else{
                createdOrder.id=response.id;
                let result={
                    message: "Order successfully created",
                    order:createdOrder
                }
                return callBack(null, 200 , result);
            } 

        })
        .catch(err=>{
            console.log(err)
            return callBack(err.message, 500)
        })

}

const confirmOrderService= async (data,callBack)=>{
    const{orderId,paymentId,ownerId,parking,bookingTime,bookingSpots,total}=data;
    try{
        let confirmedOrder=await orderDao.confirmOrder(orderId,paymentId);
        if(!confirmedOrder||confirmedOrder.length<1){
            return callBack("Unable to confirm order", 400); 
        }
        else{
            let owner=await orderDao.fetchOwner(ownerId);
            if(!owner||owner.length<1){
                return callBack("No user Found", 200);
            }
            else{
                let transporter = nodemailer.createTransport({
                    host: process.env.SMTP_SERVER,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                      user: process.env.EMAIL_ID,
                      pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: { rejectUnauthorized: false },
                  });
        
                    let mailOptions = {
                    from: 'parkingfinder99@gmail.com',
                    to: owner[0].email,
                    subject: 'New Order recieved.',
                    html: `
                        <h1>Order recieved</h1>
                        <p>
                            New Order for parking <b>${parking.title}</b> was recieved.
                        </p>
                        <ul>
                            <li><b>ID: </b>${orderId}</li>
                            <li><b>time: </b>${bookingTime<24?bookingTime+' hours':bookingTime<168?bookingTime/24 +' days':bookingTime<672?bookingTime/(24*7)+ ' weeks': bookingTime/(24*7*4)+ ' month'}</li>
                            <li><b>Spots: </b>${bookingSpots} spots</li>
                            <li><b>Total: </b>&#8377; ${total}</li>
                        </ul>
            `
                    };
        
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
            } 
            let result={
                message: "Order successfully confirmed",
                orders: confirmedOrder
            }
            return callBack(null, 200 , result);
        } 
    }catch(err){
        return callBack(err.message, 500);
    }

}


module.exports={getAllOrdersService, findOrdersByUserIdService,findOrdersByParkingIdService,findActiveOrdersByParkingIdService,findOrdersByOrderIdService,createOrderService,confirmOrderService};
const router=require('express').Router();
const db=require('../db')
const Razorpay=require('razorpay')
const auth =require('../middleware/auth')
const nodemailer = require("nodemailer");


router.get('/',(req,res)=>{
    let query=`SELECT * FROM parking.orders WHERE isPaid IN (1) ORDER BY date DESC`;
    db.query(query,(err, foundOrder)=> {
        if(err)throw err;
        if(!foundOrder||foundOrder.length<1){
            res.status(200).send('No orders found');
        }else{
            res.status(200).send(foundOrder);
        } 
    })
})
router.get('/findOrders',(req,res)=>{ 
    let query=`SELECT * FROM orders WHERE tenantId IN (${req.query.id}) AND isPaid IN (1)  ORDER BY date DESC`;
    db.query(query,(err, foundOrder)=> {
        if(err)throw err;
        if(!foundOrder||foundOrder.length<1){
            res.status(200).send('No order found');
        }else{
            res.status(200).send(foundOrder);
        } 
    })
});
router.get('/parking/:id',(req,res)=>{ 
    let query=`SELECT * FROM orders WHERE parkingId IN (${req.params.id}) AND isPaid IN (1)  ORDER BY date DESC`;
    db.query(query,(err, foundOrder)=> {
        if(err)throw err;
        if(!foundOrder||foundOrder.length<1){
            res.status(200).send('No order found');
        }else{
            res.status(200).send(foundOrder);
        } 
    })
});
router.get('/parking/active/:id',(req,res)=>{ 
    let query=`SELECT * FROM orders WHERE parkingId IN (${req.params.id}) AND isPaid IN (1) AND isActive IN (1)  ORDER BY date DESC`;
    db.query(query,(err, foundOrder)=> {
        if(err)throw err;
        if(!foundOrder||foundOrder.length<1){
            res.status(200).send([]);
        }else{
            res.status(200).send(foundOrder);
        } 
    })
});
router.get('/:id',(req,res)=>{ 
    let query=`SELECT * FROM orders WHERE id IN ('${req.params.id}')`;
    db.query(query,(err, foundOrder)=> {
        if(err)throw err;
        if(!foundOrder||foundOrder.length<1){
            res.status(200).send('No order found');
        }else{
            res.status(200).send(foundOrder);
        } 
    })
});
router.post('/', auth,(req,res)=>{
    if(req.user){
        const {tenant,parking,bookingTime,bookingSpots,total}=req.body;
        let instance = new Razorpay({
            key_id: 'rzp_test_Je0UKuTNU3Tl5d',
            key_secret: 'm6pQy50jytgyl2WwPFls1myo',
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
        .then(response=>{
                
                let query=`INSERT INTO orders (id,tenantId,parkingId,bookingTime,bookingSpots,totalCost) values ('${response.id}',${tenant},${parking},${bookingTime},${bookingSpots},${total})`;
                db.query(query,(err, createdOrder)=> {
                    if(err)throw err;
                    if(!createdOrder||createdOrder.length<1){
                        res.status(200).send('Order not created');
                    }else{
                        res.status(200).send(response);
                    } 
                })
            })
        .catch(err=>res.status(400).send(err))
    }
})
router.put('/',auth,(req,res)=>{
    if(req.user){
        const{orderId,paymentId,ownerId,parking,bookingTime,bookingSpots,total}=req.body;
        let query=`UPDATE orders SET isPaid=1,paymentId='${paymentId}' WHERE id='${orderId}';`
        db.query(query,(err, updatedOrder)=> {
            if(err) throw err;
            let query=`SELECT * FROM users  WHERE id='${ownerId}';`
            db.query(query,(err, owner)=> {
                let nodemailer = require('nodemailer');
                let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'parkingfinder99@gmail.com',
                    pass: '#helloworld123'
                }
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
                res.status(200).send(updatedOrder)
            })
        })
    }
})
module.exports=router;
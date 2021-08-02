const express=require('express');
const cors=require('cors');
const order =require('./routes/order.Route');
const auth=require('./routes/auth.Route')
const register =require('./routes/register.Route');
const login =require('./routes/login.Route');
const review =require('./routes/review.Route');
const parkings =require('./routes/parking.Route');
const uploadImg =require('./routes/uploadImg.Route');
const cleanup =require('./routes/cleanup.Route');
const app=express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use('/images',express.static('images'));
app.use('/auth',auth);
app.use('/register',register);
app.use('/login',login);
app.use('/order',order);
app.use('/parkings',parkings);
app.use('/review',review);
app.use('/uploadImg',uploadImg);
app.use('/cleanup',cleanup);

app.listen(2800,()=>{
    console.log('server started');
})
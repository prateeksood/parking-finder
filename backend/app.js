const express=require('express');
const cors=require('cors');
const order =require('./routes/order');
const auth =require('./routes/auth');
const review =require('./routes/review');
const parkings =require('./routes/parking.js');
const uploadImg =require('./routes/uploadImg');
const image =require('./routes/images');
const cleanup =require('./routes/cleanup');
const app=express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use('/images',express.static('images'));
app.use('/auth',auth);
app.use('/order',order);
app.use('/parkings',parkings);
app.use('/review',review);
app.use('/uploadImg',uploadImg);
app.use('/image',image);
app.use('/cleanup',cleanup);

app.listen(2800,()=>{
    console.log('server started');
})
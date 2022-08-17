const express=require('express');
const path = require('path');
const cors=require('cors');
const order =require('./routes/order.Route');
const auth=require('./routes/auth.Route')
const register =require('./routes/register.Route');
const login =require('./routes/login.Route');
const review =require('./routes/review.Route');
const parkings =require('./routes/parking.Route');
const uploadImg =require('./routes/uploadImg.Route');
const cleanup =require('./routes/cleanup.Route');
const PORT=process.env.PORT ||2800;
const app=express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.static("frontend/build"));
app.use('/api/images',express.static('images'));
app.use('/api/auth',auth);
app.use('/api/register',register);
app.use('/api/login',login);
app.use('/api/order',order);
app.use('/api/parkings',parkings);
app.use('/api/review',review);
app.use('/api/uploadImg',uploadImg);
app.use('/api/cleanup',cleanup);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "build", "index.html"));
    console.log(path.resolve(__dirname, "./frontend", "build", "index.html"));
});
app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`);
})
const router=require('express').Router();
const db=require('../db')
const uploadImg=require('./uploadImg');

router.get('/:id',(req,res)=>{
    let query=`SELECT * FROM images where parkingId in (${req.params.id})`
    db.query(query,(err, images)=> {
        if (err) throw err;
        if(!images||images.length<1){
            res.status(200).send('No images found');
        }else{
            res.status(200).send(images);
        }
    });
});

module.exports=router;
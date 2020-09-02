const router=require('express').Router();
const db=require('../db')
const auth=require('../middleware/auth');

router.post('/:id',auth,(req,res)=>{
    const{reviewHead,reviewBody,rating,authorId,authorName}=req.body.review
    let query=`INSERT INTO reviews (reviewHead,reviewBody,rating,parkingId,authorId,authorName) VALUES ("${reviewHead}","${reviewBody}",${rating},${req.params.id},${authorId},"${authorName}")`;
    db.query(query,(err, insertedReview)=> {
        if(err) throw err;
        res.status(200).json({
            message: "review successfully created",review:{...req.body.review,id:insertedReview.insertId},isError: false});
    })
})
router.get('/:id',(req,res)=>{
    let query=`SELECT * FROM reviews WHERE parkingId in (${req.params.id})`
    db.query(query,(err, reviews)=> {
        if (err) throw err;
        if(!reviews||reviews.length<1){
            res.status(200).send([]);
        }else{
            res.status(200).send(reviews);
        }
    });
});
router.delete('/:id',auth,(req,res)=>{
    let query=`DELETE FROM reviews WHERE id=${req.params.id}`;
    db.query(query,(err, deletedParking)=> {
        if(err)throw err;
        if(!deletedParking||deletedParking.length<1){
            res.status(200).send('No parking deleted');
        }else{
            res.status(200).send(`successfully deleted ${deletedParking}`);
        }
    });
});
module.exports=router;
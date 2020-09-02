const router=require('express').Router();
const db=require('../db')
const auth=require('../middleware/auth');

router.delete('/',auth,(req,res)=>{
    let query=`DELETE FROM orders WHERE isPaid IN (0)`;
    db.query(query,(err, deletedOrders)=> {
        if(err)throw err;
        query=`UPDATE orders SET isActive=0 WHERE bookingTime < (UNIX_TIMESTAMP(CURRENT_TIMESTAMP) - UNIX_TIMESTAMP(orders.date))/3600`;
        db.query(query,(err, orders)=> {
            if(err)throw err;
            else{
                res.status(200).send('cleanup done!');
            }
        });
    });
});
router.get('/',(req,res)=>{
    
});
module.exports=router;
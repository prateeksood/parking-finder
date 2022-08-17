const router=require('express').Router();
const cleanupController=require("../controllers/cleanup.Controller");
const auth=require('../middleware/auth');

router.delete('/unpaid',auth,cleanupController.deleteUnpaidOrders);

router.put('/inactive',cleanupController.updateInactiveOrders);

module.exports=router;
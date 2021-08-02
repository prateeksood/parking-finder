const router=require('express').Router();
const auth =require('../middleware/auth');
const orderController=require("../controllers/order.Controller");


router.get('/',orderController.getAllOrders);

router.get('/find/all/by-user-id/:id',orderController.findOrdersByUserId);

router.get('/find/all/by-parking-id/:id',orderController.findOrdersByParkingId);

router.get('/find/all/by-order-id/:id',orderController.findOrdersByOrderId);

router.get('/find/active/by-parking-id/:id',orderController.findActiveOrdersByParkingId);

router.post('/', auth,orderController.createOrder);

router.put('/',auth,orderController.confirmOrder)

module.exports=router;
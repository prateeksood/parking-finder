const router=require('express').Router();
const auth=require('../middleware/auth');
const parkingController=require('../controllers/parking.Controller')

router.get('/',parkingController.getAllParkings)

router.get('/find/all/by-parking-id/:id',parkingController.getParkingsByParkingId)

router.get('/find/all/by-owner-id/:id',parkingController.getParkingsByUserId)

router.post('/',auth,parkingController.createParking)

router.put('/update/:id',auth,parkingController.updateParking)

router.put('/disable/:id',auth,parkingController.disableParking)

module.exports=router;
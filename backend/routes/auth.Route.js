const router = require("express").Router();
const auth = require("../middleware/auth");
const authController =require( "../controllers/auth.Controller");


router.get("/user", auth, authController.findUser);

router.get("/user/:id",authController.findUser)

module.exports = router;

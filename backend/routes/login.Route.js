const router = require("express").Router();
const loginController=require("../controllers/login.Controller")

router.post("/", loginController.loginUser)

module.exports = router;

  

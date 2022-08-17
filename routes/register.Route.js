const router = require("express").Router();

const registerController =require( "../controllers/register.Controller");

router.post("/", registerController.registerUser);

module.exports = router;

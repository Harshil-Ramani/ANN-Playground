const login = require("./login.js");
const logout = require("./logout.js");
const register=  require("./register.js");

const express = require('express');
const router=express.Router();

router.use(login);
router.use(logout);
router.use(register);

module.exports=router;
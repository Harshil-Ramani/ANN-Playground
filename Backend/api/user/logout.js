const express = require('express');
const database = require('../../database.js');
const jwt=require("./../../jwt.js");

const router=express.Router();

router.get('/logout',async (req,res)=>{
    let token=jwt.generateToken(undefined,true);
    res.json({token:token});
});

module.exports=router;
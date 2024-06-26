const express = require('express');
const database = require('../../database.js');
const setDefault = require('../setDefault.js');
const jwt=require("./../../jwt.js");


const router=express.Router();

router.post('/register',async (req,res)=>{
    let {userName,email,password} = req.body;
    let userModel=database.user;
    let user=await userModel.findOne({userName:userName});
    if(user) {
        res.json({error:"Username already exist!"});
        return;
    }
    if(!user) user=await userModel.findOne({email:email});
    if(user) {
        res.json({error:"Email already registered!"});
        return;
    }

    let newUser = new userModel({
        userName:userName,
        email:email,
        password:password, 
        ... await setDefault.setDefault()
    });
    await newUser.save();

    let token = jwt.generateToken(userName,false);
    let userInfo={
        userName:userName,
        isGuest:false
    };

    res.json({token:token,userInfo:userInfo});
});

module.exports=router;
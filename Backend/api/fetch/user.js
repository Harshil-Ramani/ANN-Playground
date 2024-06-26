const express = require('express');
const database = require('./../../database.js');
const setDefault = require('./../setDefault.js');
const jwt=require("./../../jwt.js");

const router=express.Router();

router.get('/user', async(req,res)=>{
    if(req.token.isGuest) {
        let user={
            userName:undefined,
            isGuest:true,
            ...await setDefault.setDefault()
        };
        res.json({user:user,token:req.token});
        return;
    }
    let userModel=database.user;
    let userName=req.token.userName;
    let user=await userModel.findOne({userName:userName});
    user=user.toObject();
    // console.log(user);
    user.isGuest=false;

    let token = jwt.generateToken(userName,false);
    res.json({user:user,token:token});
});

module.exports=router;




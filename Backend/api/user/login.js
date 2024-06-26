const express = require('express');
const database = require('../../database.js');
const session = require('express-session');
const jwt=require("./../../jwt.js");

const router=express.Router();

router.post('/login',async (req,res)=>{
    let {userNameOrEmail,password} = req.body;
    let userModel=database.user;
    let user=await userModel.findOne({userName:userNameOrEmail});
    if(!user) user=await userModel.findOne({email:userNameOrEmail});
    if(user) {
        let userName=user.userName;
        let token =jwt.generateToken(userName,false);
        let userInfo={
            userName:userName,
            isGuest:false
        }
        res.json({token:token,userInfo:userInfo});
    }
    else {
        res.json({error:"Invalid username/email or password!"});
    }
});

module.exports=router;
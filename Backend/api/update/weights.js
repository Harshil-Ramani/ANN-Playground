const express = require('express');
const database = require('./../../database.js');
const jwt=require('./../../jwt.js');

const router=express.Router();

router.post('/weights', async(req,res)=>{
    if(req.token.isGuest)
    {
        res.json({error:"You are requird to login first!"});
        return;
    }
    let {weights,biases,epochCount}=req.body;
    let userName=req.token.userName;
    let userModel=database.user;
    let oldLastStatus = await userModel.findOne({userName:userName},{lastStatus:{epochCount:1},_id:0});
    if(oldLastStatus.lastStatus.epochCount!=0 || epochCount==1)
        await userModel.updateOne({userName:userName},{$set : {"lastStatus.weights":weights,"lastStatus.biases":biases,"lastStatus.epochCount":epochCount}},{new:true});

    let token =jwt.generateToken(userName,false);

    res.json({token:token});
});

module.exports=router;
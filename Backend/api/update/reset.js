const express = require('express');
const fs=require('fs');
const database = require('./../../database.js');
const setDefault = require('./../setDefault.js');
const jwt = require("./../../jwt.js");

const router=express.Router();

router.post('/reset', async(req,res)=>{
    let userName=req.token.userName;
    let userModel=database.user;
    let defaults=fs.readFileSync('defaultDatasets.json','utf8');
    defaults=JSON.parse(defaults);
    let currentDataset=defaults.default;
    if(!req.token.isGuest)
    {
        let user=await userModel.findOne({userName:userName},{lastStatus:{currentDataset:1}, _id:0});
        currentDataset=user.lastStatus.currentDataset;
    }
    let parameters = {
        learningRate: 0.05,
        regularizationType: 0,
        regularizationRate: 0,
        splitRatio: 80,
        batchSize: 10,
    };
    let lastStatus=await setDefault.updateParameters(currentDataset,parameters);
    if(!req.token.isGuest){
        await userModel.updateOne({userName:userName},{$set:{
            lastStatus:lastStatus
        }});
    }
    if(req.token.isGuest)token=jwt.generateToken(undefined,true);
    else token=jwt.generateToken(req.token.userName,false);
    res.json({lastStatus:lastStatus,token:token});
});

module.exports=router;
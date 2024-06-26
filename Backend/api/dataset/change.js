const express = require('express');
const database = require('./../../database.js');
const setDefault = require('../setDefault.js');
const jwt=require('./../../jwt.js');

const router=express.Router();

router.post('/change', async(req,res)=>{
    let userName=req.token.userName;
    let userModel = database.user;

    let parameters=req.body.parameters;
    let newDatasetId=req.body.datasetId;
    let layers=req.body.layers;

    let lastStatus = await setDefault.updateParameters(newDatasetId,parameters,layers);

    if(!req.token.isGuest)await userModel.updateOne({userName:userName},{$set:{
        lastStatus:lastStatus
    }});

    let token;
    if(req.token.isGuest)token = jwt.generateToken(undefined,true);
    else token = jwt.generateToken(userName,false);

    res.json({token:token,lastStatus:lastStatus});
});

module.exports=router;
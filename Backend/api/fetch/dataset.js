const express = require('express');
const database = require('./../../database.js');
const jwt=require('./../../jwt.js');

const router=express.Router();

router.get('/dataset', async(req,res)=>{
    let datasetModel=database.dataset;
    let datasetId=req.query.datasetId
    let dataset=await datasetModel.findById(datasetId);
    let token;
    if(req.token.isGuest)token=jwt.generateToken(undefined,true);
    else token=jwt.generateToken(req.token.userName,false);
    res.json({dataset:dataset,token:token});
});

module.exports=router;
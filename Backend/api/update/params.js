const express = require('express');
const database = require('./../../database.js');
const setDefault=require('./../setDefault.js');
const jwt=require('./../../jwt.js');

const router=express.Router();

router.post('/params', async(req,res)=>{
    if(req.token.isGuest)
    {
        let datasetModel=database.dataset;
        let currentDataset=req.body.currentDataset;
        let dataset=await datasetModel.findOne({_id:currentDataset});
        let numberOfDataPoints=dataset.dataPoints.length;
        let newParams=req.body.parameters;
        let trainTest=setDefault.calculateTrainTest(newParams.splitRatio,numberOfDataPoints);
        newParams.trainTest=trainTest;
        let token =jwt.generateToken(undefined,true);
        res.json({token:token,parameters:newParams});
        return;
    }

    let userModel=database.user;
    let userName=req.token.userName;
    let {lastStatus:{parameters,currentDataset}}=await userModel.findOne({userName:userName},{lastStatus:{parameters:1,currentDataset:1},_id:0});
    let newParams=req.body.parameters;

    let newMapNeed=false;
    for(key in newParams)
    {   
        if(key!='learningRate' && newParams[key]!=parameters[key])
        {
            newMapNeed=true;
        }
    }
    
    await userModel.updateOne({userName:userName},{$set:{"lastStatus.parameters":newParams}});

    if(newMapNeed){
        let datasetModel=database.dataset;
        let dataset=await datasetModel.findOne({_id:currentDataset});
        let numberOfDataPoints=dataset.dataPoints.length;
        let trainTest=setDefault.calculateTrainTest(newParams.splitRatio,numberOfDataPoints);
        await userModel.updateOne({userName:userName},{$set:{"lastStatus.trainTest":trainTest,"lastStatus.epochCount":0}});
        newParams.trainTest=trainTest;
        newParams.epochCount=0;
    }

    let token =jwt.generateToken(userName,false);

    res.json({token:token,parameters:newParams});
});

module.exports=router;
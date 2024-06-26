const express = require('express');
const database = require('./../../database.js');
const jwt = require('./../../jwt.js');
const fs=require('fs');

const router=express.Router();

router.delete('/delete', async(req,res)=>{
    if(req.token.isGuest)
    {
        res.json({error:"please login first!"});
        return;
    }

    let datasetId=req.body.datasetId;
    let isCurrent=req.body.isCurrentDataset;

    let currentDataset;
    if(isCurrent==true) {
        let defaults=fs.readFileSync('defaultDatasets.json','utf8');
        defaults=JSON.parse(defaults);
        currentDataset=defaults.default;
    }

    let userModel=database.user;
    let userName=req.token.userName;
    await userModel.updateOne({userName:userName},{$pull : {datasets: datasetId}},{new:true});
    let datasetModel=database.dataset;
    await datasetModel.deleteOne({_id:datasetId});

    let {datasets}=await userModel.findOne({userName:userName},{"datasets":1, "_id":0});
    let token = jwt.generateToken(userName,false);

    res.json({token:token,currentDataset:currentDataset,datasets:datasets});
});

module.exports=router;
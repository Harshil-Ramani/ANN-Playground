const express = require('express');
const database = require('./../../database.js');
const jwt =require('./../../jwt.js');

const router=express.Router();

router.post('/upload', async(req,res)=>{
    
    if(req.token.isGuest)
    {
        res.json({error:"Please login first!"});
        return;
    }

    let datasetObject=req.body.dataset;
    let datasetModel=database.dataset;
    let newDataset= new datasetModel(datasetObject);
    await newDataset.save();

    let userModel=database.user;
    let userName=req.token.userName;
    await userModel.updateOne({userName:userName},{$push:{datasets:newDataset._id}},{new: true});
    let {datasets}=await userModel.findOne({userName:userName},{"datasets":1, "_id":0});

    let token = jwt.generateToken(userName,false);
    res.json({token:token,datasets:datasets,currentDatasetId:newDataset._id});
});

module.exports=router;
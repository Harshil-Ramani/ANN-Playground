// const express = require('express');
// const database = require('./../../database.js');

// const router=express.Router();

// router.get('/datasetList', async(req,res)=>{
//     if(!req.session.userName) {
//         res.json("Please login first!");
//     }
//     let userName=req.session.userName;
//     let userModel = database.user;
//     let datasetModel = database.dataset;
//     let user=await userModel.findOne({userName:userName});
//     let datasets=user.datasets;
//     datasets=await Promise.all(datasets.map(async (datasetId)=>{
//         let dataset=await datasetModel.findById(datasetId,'name type -datapoints').exec();
//         return dataset;
//     }));
//     res.json(datasets);
// });

// module.exports=router; 
const express = require('express');
const database = require('./../../database.js');
const setDefault = require("./../setDefault.js");
const jwt = require("./../../jwt.js");

const router=express.Router();

router.post('/incrementNeuron', async(req,res)=>{
    
    let userModel=database.user;
    let userName=req.token.userName;
    let {numberOfLayers,layers,layerIndex} = req.body;
    layers[layerIndex].numberOfNeurons++;
    let {weights,biases} = await setDefault.assignWeights(numberOfLayers,layers);
    let updates = {
        numberOfLayers:numberOfLayers,
        layers:layers,
        weights:weights,
        biases:biases,
        epochCount:0
    }

    if(!req.token.isGuest)
    {
        await userModel.updateOne({ userName: userName }, {$set:{
            "lastStatus.numberOfLayers":numberOfLayers,
            "lastStatus.layers": layers,
            "lastStatus.weights": weights,
            "lastStatus.biases": biases,
            "lastStatus.epochCount":0
        }}, { new: true });
    }
    let token;
    if(req.token.isGuest)token=jwt.generateToken(undefined,true);
    else token=jwt.generateToken(req.token.userName,false);
  
    res.json({token:token,updates:updates});
});

module.exports=router;
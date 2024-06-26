const express = require('express');
const database = require('./../../database.js');
const jwt = require("./../../jwt.js");
const setDefault = require('../setDefault.js');

const router=express.Router();

router.post('/activationChange', async(req,res)=>{

    let userName=req.token.userName;
    let userModel=database.user;
    let {layers,numberOfLayers,layerIndex,activation} = req.body;
    activation=Number(activation);
    layers[layerIndex].activation=activation;

    let {weights,biases}=await setDefault.assignWeights(numberOfLayers,layers);

    let updates = {
        lastStatus:{
            weights:weights,
            biases:biases,
            layers:layers,
            epochCount:0
        }
    }

    if(!req.token.isGuest) {
        await userModel.updateOne({userName:userName},{$set:{
            "lastStatus.layers":layers,
            "lastStatus.epochCount":0,
            "lastStatus.weights":weights,
            "lastStatus.biases":biases
        }},{new:true});
    }
    
    let token;
    if(req.token.isGuest)token=jwt.generateToken(undefined,true);
    else token=jwt.generateToken(req.token.userName,false);
    
    res.json({token:token,lastStatus:updates.lastStatus});
});

module.exports=router;



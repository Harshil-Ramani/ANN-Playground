const activationChange = require("./activationChange.js");
const decrementLayer = require("./decrementLayer.js");
const incrementLayer =  require("./incrementLayer.js");
const incrementNeuron =  require("./incrementNeuron.js");
const decrementNeuron =  require("./decrementNeuron.js");
const reset =  require("./reset.js");
const params =  require("./params.js");
const weights =  require("./weights.js");

const express = require('express');
const router=express.Router();

router.use(activationChange);
router.use(decrementLayer);
router.use(incrementLayer);
router.use(incrementNeuron);
router.use(decrementNeuron);
router.use(reset);
router.use(params);
router.use(weights);

module.exports=router;
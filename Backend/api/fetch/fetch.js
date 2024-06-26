const dataset = require("./dataset.js");
const user = require("./user.js");

const express = require('express');
const router=express.Router();

router.use(dataset);
router.use(user);

module.exports=router;
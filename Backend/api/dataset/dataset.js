const change = require("./change.js");
const deleteDatabase = require("./delete.js");
const upload =  require("./upload.js");

const express = require('express');
const router=express.Router();

router.use(change);
router.use(deleteDatabase);
router.use(upload);

module.exports=router;
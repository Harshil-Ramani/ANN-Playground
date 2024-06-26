const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database.js');
const cors= require('cors');
const jwt=require('./jwt.js');

const dataset = require('./api/dataset/dataset.js');
const user = require('./api/user/user.js');
const fetch = require('./api/fetch/fetch.js');
const update = require('./api/update/update.js');

const app=express();

app.use(cors({
    origin:true,
    credentials: true
}));

app.use(jwt.verifyToken);

// const session = require('express-session');
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: false,
// }));

app.use(bodyParser.json());
  
app.get("/",(req,res)=>{
    res.end("hello world");
});

app.use("/dataset",dataset);
app.use("/user",user);
app.use("/fetch",fetch);
app.use("/update",update);

app.listen(3000,()=>{
    console.log("server is running on url : http://localhost:3000/");
});

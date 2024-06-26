const jwt= require('jsonwebtoken');
const { model } = require('mongoose');

async function verifyToken(req,res,next)
{
    let token=req.header('Authorization');
    req.token={userName:undefined,isGuest:true};
    if(!token || !token.startsWith('Bearer '))
    {
        next();
        return;
    }
    token=token.substring(7);
    let decoded;
    try{
        decoded=jwt.verify(token,'your-secret-key');
    }
    catch(error){
        next();
        return;
    }
    req.token={userName:decoded.userName,isGuest:decoded.isGuest};
    next();
}

function generateToken(userName,isGuest)
{
    return jwt.sign({userName:userName,isGuest:isGuest},'your-secret-key');
}

module.exports={
    verifyToken:verifyToken,
    generateToken:generateToken
};
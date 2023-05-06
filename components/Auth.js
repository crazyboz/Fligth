const CatchAsync = require("./Error")
const Apperr = require("../ErrorHandling/App")
const jwt =require("jsonwebtoken")
const User = require("../schema_model/users")
const {promisify} = require("util")


exports.protectionuser= CatchAsync(async (req,res,next)=>{
    const token = req.query.Authentication
    if(!token){
        return next(new Apperr("You are logged out",400))
    }
    
    const result  =  await promisify(jwt.verify)(token,process.env.JSON_SECRET)
    
    const data =await User.findById(result.id)
    if(!data){
        return next(new Apperr("the token the doesn't exits ",401))   
    }

    req.user=data
    next()
})

exports.protectionadmin=CatchAsync(async (req,res,next)=>{
    const token = req.query.Authentication
    if(!token){
        return next(new Apperr("You are logged out",401))
    }
    
    const result  =  await promisify(jwt.verify)(token,process.env.JSON_SECRET)
    
    const data =await User.findOne({_id:result.id,role:"Admin"})
    if(!data){
        return next(new Apperr("the token the doesn't exits ",401))   
    }

    req.user=data
    next()
})
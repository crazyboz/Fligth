const express= require("express")
const CatchAsync = require("./components/Error.js")
const User = require("./schema_model/users.js")
const Apperr = require("./ErrorHandling/App.js")
const jwt =require("jsonwebtoken")
const {protectionuser}= require("./components/Auth.js")

const UsersRouter=express.Router()

UsersRouter.post("/signup",CatchAsync(async (req,res,next)=>{
    const obj={}
    obj["username"]=req.body.username
    obj["email"]=req.body.email
    obj["password"]=req.body.password
    obj["conformpassword"]=req.body.conformpassword
    obj["gender"]=req.body.gender

    const data = await User.create(obj)

    const token = jwt.sign({id:data._id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXP})

    res.status(201).send({
        status:"success",
        token,
        data
    })
}))

UsersRouter.post("/login",CatchAsync(async (req,res,next)=>{
    const {email,password}=req.body

    if(!email || !password){
        return next(new Apperr("Please enter the remail and password",400))
    }
    
    const data = await User.findOne({email,role:"User"}).select("+password")
    const correct = await data.correctPassword(password,data.password)
    
    if(!data || !correct){
        return next(Apperr("Incorrect password or email",401))
    }
    
    const token = jwt.sign({id:data._id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXP})

    res.status(200).send({
        status:"success",
        token,
        data
    })
}))



module.exports= UsersRouter
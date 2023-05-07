const express= require("express")
const User = require("./schema_model/users")
const CatchAsync = require("./components/Error.js")
const flightDetails = require("./schema_model/flight_details.js")
const jwt = require("jsonwebtoken")
const {protectionadmin}= require("./components/Auth")
const AirportDetails = require("./schema_model/airport")
const Apperr = require("./ErrorHandling/App")
const BookedDetails = require("./schema_model/booking")

const AdminRouter=express.Router()

// AdminRouter.post("/signup",CatchAsync(async (req,res,next)=>{
//     const obj={}
//     obj["username"]=req.body.username
//     obj["email"]=req.body.email
//     obj["password"]=req.body.password
//     obj["conformpassword"]=req.body.conformpassword
//     obj["role"]=req.body.role

//     const data = await User.create(obj)

//     const token = jwt.sign({id:data._id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXP})

//     res.status(201).send({
//         status:"success",
//         token,
//         data
//     })
// }))

AdminRouter.post("/login",CatchAsync(async (req,res,next)=>{
    const {email,password}=req.body

    if(!email || !password){
        return next(new Apperr("Please enter the remail and password",400))
    }
    
    const data = await User.findOne({email,"role":"Admin"}).select("+password")
    const correct = await data.correctPassword(password,data.password)
    
    if(!data || !correct){
        return next(Apperr("Incorrect password or email",401))
    }
    
    const token = jwt.sign({id:data._id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXP})

    let options = {
        expires : new Date(
            Date.now()+process.env.JSON_EX * 24 *60*60*1000
        ),
        httpOnly:true
    }
    if(process.env.NODE_ENV === "production"){
        options.secure = true
    }
    res.cookie("jwt",token,options)

    res.status(200).send({
        status:"success",
        token,
        data
    })
}))

AdminRouter.get("/logout",protectionadmin,CatchAsync((req,res)=>{
    const token = req.headers.cookie

    if(token){
        let options = {
            expires : new Date(
                Date.now()+process.env.JSON_EX * 24 *60*60*1000
            ),
            httpOnly:true
        }
        if(process.env.NODE_ENV === "production"){
            options.secure = true
        }
        res.cookie("jwt",token,options)
    }

    res.status(200).send("successfully loged out")
}))

AdminRouter.post("/flight",protectionadmin,CatchAsync(async (req,res)=>{
    const {flightId,name,from,to,flightTime,takeOfTime,destinationTime,seatList}=req.body

    if(!flightId || !name || !from || !to || !flightTime || !takeOfTime || !destinationTime || !seatList){
        return next(new Apperr("Please enter the flight details",400))
    }

    const seats=[] 

    seatList.forEach(element => {
        if(!element.seattype || !element.ticketcost){
            return next(new Apperr("Please enter the flight details",400))
        }

        let obj={}

        obj["seattype"]=element.seattype
        obj["numberseats"]=element.numberseats
        obj["ticketcost"]=element.ticketcost

        seats.push(obj)
    });

    const data = await flightDetails.create({flightId,name,from,to,flightTime,takeOfTime,destinationTime,seats});
    res.status(200).send(data)
}))

AdminRouter.get("/booked", protectionadmin,async (req,res)=>{
    let {flightId,bookedtime}=req.query 
    
    if(!flightId && !bookedtime){
        return next(new Apperr("please enter the deatils",400))
    }
    
    const Id=await flightDetails.findOne({"flightId":flightId}).select({"_id":1})

    const data = await BookedDetails.find({flightId:Id}).where("bookedtime").gte(bookedtime)

    if(!data){
        return next(new Apperr("There is no data avauble",400))
    }
    res.status(200).send(data)
})

AdminRouter.delete("/flight",protectionadmin,async (req,res)=>{
    const id=req.query.flightId
    if(!id){
        return next(new Apperr("Please send the flight id",400))
    } 

    await flightDetails.findOneAndDelete({flightId:id}) 
    res.status(200).send({"masg":"successfully deleted"})  
})

AdminRouter.post("/airport",protectionadmin,async (req,res)=>{
    const {name,country,city}=req.body

    if(!name || !country || !city){
        return next(new Apperr("Please enter the details details"),400)
    }

    const data = await AirportDetails.create({name,city,country})

    res.status(200).send(data)
})

module.exports=AdminRouter
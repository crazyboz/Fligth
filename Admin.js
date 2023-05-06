const express= require("express")
const User = require("./schema_model/users")
const CatchAsync = require("./components/Error.js")
const flightDetails = require("./schema_model/flight_details.js")
const jwt = require("jsonwebtoken")
const {protectionadmin}= require("./components/Auth")
const AirportDetails = require("./schema_model/airport")
const Apperr = require("./ErrorHandling/App")

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

    res.status(200).send({
        status:"success",
        token,
        data
    })
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

AdminRouter.get("/flight", protectionadmin,async (req,res)=>{
    let data 
    if(req.query.flightName){
        data = await flightDetails.find({name:req.query.flightName}).exec()
    }else if(req.query.flightTime){
        // data = await flightDetails.find({'$where': 'this.takeOfTime.toJSON().slice(0, 10) == "2023-05-10"'})
        data="fghj"
    }

    res.status(200).send(data)
})

AdminRouter.delete("/flight",protectionadmin,async (req,res)=>{
    await flightDetails.findOneAndDelete({flightId:req.query.flightId}) 
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
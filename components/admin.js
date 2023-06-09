const CatchAsync = require("../components/Error.js")
const User = require("../schema_model/users")
const flightDetails = require("../schema_model/flight_details.js")
const jwt = require("jsonwebtoken")
const AirportDetails = require("../schema_model/airport.js")
const Apperr = require("../ErrorHandling/App.js")
const BookedDetails = require("../schema_model/booking.js")

exports.login=CatchAsync(async (req,res,next)=>{
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

    data["password"]=undefined
    res.status(200).send({
        status:"success",        
        data
    })
})

exports.logout = CatchAsync((req,res)=>{

    let options = {
        expires : new Date(
            Date.now()+process.env.JSON_EX * 24 *60*60*1000
        ),
        httpOnly:true
    }
    if(process.env.NODE_ENV === "production"){
        options.secure = true
    }
    res.cookie("jwt","",options)
    res.status(200).json({
        status:"success",        
        msg:"successfully loged out"
    })
})

exports.addflight = CatchAsync(async (req,res,next)=>{
    const {flightId,name,from,to,flightTime,takeOfTime,destinationTime,seatList,flighttype}=req.body

    if(!flightId || !name || !from || !to || !flightTime || !takeOfTime || !destinationTime || !seatList || !flighttype){
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

    const data = await flightDetails.create({flightId,name,from,to,flightTime,takeOfTime,destinationTime,seats,flighttype});
    res.status(200).send({
        status:"success",        
        data
    })
})

exports.booking = CatchAsync(async (req,res)=>{
    let {flightId,bookedtime}=req.query 
    
    if(!flightId && !bookedtime){
        return next(new Apperr("please enter the deatils",400))
    }
    
    const Id=await flightDetails.findOne({"flightId":flightId}).select({"_id":1})

    const data = await BookedDetails.find({flightId:Id}).where("bookedtime").gte(bookedtime)

    if(!data){
        return next(new Apperr("There is no data avauble",400))
    }
    res.status(200).send({
        status:"success",        
        data
    })
})

exports.deleteflight = CatchAsync(async (req,res)=>{
    const id=req.query.flightId
    if(!id){
        return next(new Apperr("Please send the flight id",400))
    } 

    await flightDetails.findOneAndDelete({flightId:id}) 
    res.status(200).send({
        status:"success",        
        msg:"successfully deleted"
    })  
})

exports.addairport = CatchAsync(async (req,res)=>{
    const {name,country,city}=req.body

    if(!name || !country || !city){
        return next(new Apperr("Please enter the details details"),400)
    }

    const data = await AirportDetails.create({name,city,country})

    res.status(200).send({
        status:"success",        
        data
    })
})
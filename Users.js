const express= require("express")
const CatchAsync = require("./components/Error.js")
const User = require("./schema_model/users.js")
const Apperr = require("./ErrorHandling/App.js")
const jwt =require("jsonwebtoken")
const {protectionuser}= require("./components/Auth.js")
const FlightDetails = require("./schema_model/flight_details.js")
const BookedDetails = require("./schema_model/booking.js")
const nodemailer = require('nodemailer');

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

UsersRouter.post("/booking",protectionuser,CatchAsync(async (req,res,next)=>{
    const {flightId,passengerslist}=req.body
    const userId=req.user._id
    let passengers=[]
    
    let {seats,takeOfTime} = await FlightDetails.findOne({_id:flightId}).select({ "seats":1, "takeOfTime":1 ,"_id": 0})
     
    if(!takeOfTime || !seats){
        return next(new Apperr("flight is not available",400))
    }

    if(!(takeOfTime >= Date.now())){
        return next(new Apperr("you can't book the ticket",400))
    }

    passengerslist.forEach(passenger => {
        let obj={}
        let index=-1

        obj["passengername"]=passenger.passengername
        obj["age"]=passenger.age
        obj["passportnumber"]=passenger.passportnumber
        obj["phonenumber"]=passenger.phonenumber
        obj["seattype"]=passenger.seattype

        seats.forEach((items,indx) => {
            if(passenger.seattype.toLowerCase() === items.seattype.toLowerCase()){
                return index =indx
            }
        })

        if(index == -1){
            return next(new Apperr("Please enter the seat details",400))
        }

        if(!(seats[index].numberseats>0)){
            return next(new Apperr("Seats doesn't avaible",400))
        }

        obj["ticketcost"]=seats[index].ticketcost
        if(seats[index].seattype.toLowerCase() === "normalclass"){
            obj["numberseats"]=seats[index].numberseats+"N"
        }else{
            obj["numberseats"]=seats[index].numberseats+"B"
        }

        seats[index].numberseats-=1
        passengers.push(obj)
    })
    
    const data = await BookedDetails.create({passengers,"userid":userId,"flightid":flightId})
    const seatupdate = await FlightDetails.findByIdAndUpdate(flightId,{seats})

    if(!seatupdate || !data){
        return next(new Apperr("something went wrong",400))
    }

    // const transporter = nodemailer.createTransport({
    //     port: 465,               // true for 465, false for other ports
    //     host: "smtp.gmail.com",
    //         auth: {
    //             user: '@gmail.com',
    //             pass: '',
    //             },
    //     secure: true,
    // });

    res.status(200).send(data)
}))

UsersRouter.get("/booking",protectionuser,CatchAsync(async (req,res,next)=>{
    const {id}=req.user

    const data = await BookedDetails.find({"userid":id}).sort({"bookedtime":-1})

    res.status(200).send(data)
}))

module.exports= UsersRouter
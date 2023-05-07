const CatchAsync = require("../components/Error.js")
const User = require("../schema_model/users.js")
const Apperr = require("../ErrorHandling/App.js")
const jwt =require("jsonwebtoken")
const FlightDetails = require("../schema_model/flight_details.js")
const BookedDetails = require("../schema_model/booking.js")


exports.signup = CatchAsync(async (req,res,next)=>{
    const obj={}
    obj["username"]=req.body.username
    obj["email"]=req.body.email
    obj["password"]=req.body.password
    obj["conformpassword"]=req.body.conformpassword
    obj["gender"]=req.body.gender

    const data = await User.create(obj)

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

    res.status(201).send({
        status:"success",
        data
    })
}) 

exports.login = CatchAsync(async (req,res,next)=>{
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

    res.status(200).JSON({msg:"successfully loged out"})
})

exports.addbooking = CatchAsync(async (req,res,next)=>{
    const {flightId,passengerslist}=req.body
    const userId=req.user._id
    let passengers=[]
    
    let {seats,takeOfTime,flighttype} = await FlightDetails.findOne({_id:flightId}).select({ "seats":1, "takeOfTime":1 ,"flighttype":1,"_id": 0})
     
    if(!takeOfTime || !seats || !flighttype){
        return next(new Apperr("flight is not available",400))
    }

    if(!(takeOfTime >= Date.now())){
        return next(new Apperr("you can't book the ticket",400))
    }

    passengerslist.forEach(passenger => {
        let obj={}
        let index=-1

        if(!passenger.passengername || !passenger.age || !passenger.phonenumber || !passenger.seattype){
            return next(new Apperr("please enter the passengers details",400))
        }

        obj["passengername"]=passenger.passengername
        obj["age"]=passenger.age
        obj["phonenumber"]=passenger.phonenumber
        obj["seattype"]=passenger.seattype
        obj["flighttype"]=flighttype


        //types of flight
        if(flighttype.toLowerCase() === "international"){
            if(!(passenger.passportnumber)){
                return next(new Apperr("Passportnumber is needed.",400))
            }
            obj["passportnumber"]=passenger.passportnumber
        }else if(flighttype.toLowerCase() === "domestic"){
            if(passenger.aadhaarnumber){
                obj["aadhaarnumber"]=passenger.aadhaarnumber
            }else if(passenger.passportnumber){
                obj["passportnumber"]=passenger.passportnumber
            }else{
                return next(new Apperr("Please enter either passport or aadhaar number",400))
            }
        }

        //seat avaible
        seats.forEach((items,indx) => {
            if(passenger.seattype.toLowerCase() === items.seattype.toLowerCase()){
                return index =indx
            }
        })

        if(index == -1){
            return next(new Apperr("Please enter the seat details or the seat is not avavilable",400))
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
    res.status(200).send(data)
})

exports.getbooking = CatchAsync(async (req,res,next)=>{
    const {id}=req.user

    const data = await BookedDetails.find({"userid":id}).sort({"bookedtime":-1})

    res.status(200).send(data)
})

exports.search = CatchAsync(async(req,res,next)=>{
    const {departuredate,from,to}=req.body

    if(departuredate){
        const data = await FlightDetails.find().where("takeOfTime").gte(departuredate)
        if(!data){
            return next(new Apperr("There is no data avaible",400))
        }

        res.status.send(data)
    }

    if(!from && !to){
       return next(new Apperr("Please enter the date or departure place",400))
    }

    const data = await FlightDetails.find().where("from").equals(from.toLowerCase()).where("to").equals(to.toLowerCase())

    res.status.send(data)
})
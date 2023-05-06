const mongoose= require("mongoose")

const flight = new mongoose.Schema({
    flightId:{
        type:String,
        uniquie:true,
        required:[true,"Required the flight id"]
    },
    name:{
        type:String,
        unique:true,
        required:[true,"Enter the name of the flight uniqulyrs"]
    },
    from:{
        type:String,
        required:[true,"Enter the flight take of place"]
    },
    to:{
        type:String,
        required:[true,"Required the destination place"]
    },
    flightTime:{
        type:String,
        required:[true,"Required the flight timing"]
    },
    prize:{
        type:Number,
        required:[true, "Required the booking cost"]
    },
    takeOfTime:{
        type:Date,
        required:[true,"Required the flight take of time"]
    },
    destinationTime:{
        type:Date,
        required:[true,"Required the flight take of time"]
    },
    totalSeat:{
        type:Number,
        default:60,
        min:0,
        max:60
    },
})

const FlightDetails = mongoose.model("FlightDetails",flight)

module.exports=FlightDetails;
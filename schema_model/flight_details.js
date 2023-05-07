const mongoose= require("mongoose");
const AirportDetails = require("./airport");

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
        type:mongoose.Schema.ObjectId,
        ref:AirportDetails,
        required:[true,"Please enter airport adress"]
    },
    to:{
        type:mongoose.Schema.ObjectId,
        ref:AirportDetails,
        required:[true,"Please enter airport adress"]
    },
    flightTime:{
        type:String,
        required:[true,"Required the flight timing"]
    },
    takeOfTime:{
        type:Date,
        required:[true,"Required the flight take of time"]
    },
    destinationTime:{
        type:Date,
        required:[true,"Required the flight take of time"]
    },
    flighttype:{
        type:String,
        enum:["domestic","international"],
        required:[true,"Please enter the flight type"]
    },
    seats:[{
        seattype:{
            type:String,
            required:true,
            enum:["bussinessclass","normalclass"]
        },
        numberseats:{
            type:Number,
            required:true,
            default:60
        },
        ticketcost:{
            type:Number,
            required:true,
        }
    }]
})

const FlightDetails = mongoose.model("FlightDetails",flight)

module.exports=FlightDetails;
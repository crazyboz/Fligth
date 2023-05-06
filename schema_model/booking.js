const mongoose= require("mongoose");
const FlightDetails = require("./flight_details");
const Users = require("./users")

const booking = new mongoose.Schema({
    passengers:[{
        passengername:{
            type:String,
            required:[true,"Please enter the passenger name"]
        },
        age:{
            type:Number,
            required:[true,"Please enter the age of the passenger"],
            min:0
        },
        passportnumber:{
            type:String,
            unique:true,
            required:[true,"Please enter the passport number"]
        },
        phonenumber:{
            type:Number,
            length:10,
            requried:[true,"Mobile number in required"]
        },
        numberseats:{
            type:String,
            required:true,
            maxlength:5
        },
        seattype:{
            type:String,
            required:true,
            enum:["bussinessclass","normalclass"]
        },
        ticketcost:{
            type:Number,
            required:true
        }
    }],
    flightid:{
        type:mongoose.Schema.ObjectId,
        ref:FlightDetails,
        required:[true, "Please enter the flight details or flight id"]
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:Users,
        required:[true,"Please enter the user details ot user id"]
    },
    bookedtime:{
        type:Date,
        default:Date.now()
    }
})


const BookedDetails = mongoose.model("BookedDetails",booking)

module.exports=BookedDetails;
const mongoose= require("mongoose")

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
        seatnumber:{
            type:Number,
            min:0,
            max:60
        }
    }]
})


const Booking = mongoose.model("Booking",booking)

module.exports=Booking;
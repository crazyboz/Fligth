const mongoose = require("mongoose");

const airport = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,"Please enter the airport name"]
    },
    country:{
        type:String,
        required:[true,"Please enter the country"]
    },
    city:{
        type:String,
        required:[true,"Please enter the city"]
    }
})

const AirportDetails = mongoose.model("AirportDetails",airport)

module.exports=AirportDetails;
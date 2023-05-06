const mongoose= require("mongoose")
const validator = require("validator")

const users = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail,"Enter the email"]
    },

    password:{
        type:String,
        required:[true,"Required the password"]
    },

    comformpassword:{
        type:String,
        required:[true,"Required the conform password"],
        validate:{
            validator:function(conform){
                return conform==this.password
            }
        }
    }
})


const Users = mongoose.model("Users",users)

module.exports=Users
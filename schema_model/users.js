const mongoose= require("mongoose")
const validator = require("validator")
const bycryt = require("bcryptjs")

const users = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:[true, "The user name already exists"],
        minlength:5,
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Enter the email"]
    },

    password:{
        type:String,
        required:[true,"Required the password"],
        select:false
    },

    conformpassword:{
        type:String,
        required:[true,"Required the conform password"],
        validate:{
            validator:function(conform){
                return conform==this.password
            },
            message:"The comform password is different fron the password"
        }
    },
    gender:{
        type:String,
        maxlength:6
    },
    role:{
        type:String,
        default:"User",
        enum: { values: ['User', 'Admin'], message: '{VALUE} is not supported' }
    }
})

users.pre("save",async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bycryt.hash(this.password,10) 
    this.conformpassword = undefined
})

users.methods.correctPassword=async function(givenPassword,userPassword){
    return await  bycryt.compare(givenPassword,userPassword,)
}

const Users = mongoose.model("Users",users)

module.exports=Users
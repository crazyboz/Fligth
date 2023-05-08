const express= require("express")
const {protectionuser}= require("../components/Auth.js")
const {signup,login,logout,addbooking,getbooking,search} =require("../components/user.js")

const UsersRouter=express.Router()

UsersRouter.post("/signup",signup)

UsersRouter.post("/login",login)

UsersRouter.get("/logout",protectionuser,logout)

UsersRouter.post("/booking",protectionuser,addbooking)

UsersRouter.get("/booking",protectionuser,getbooking)

UsersRouter.post("/search",search)


module.exports= UsersRouter
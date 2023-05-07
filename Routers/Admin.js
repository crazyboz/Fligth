const express= require("express")
const {protectionadmin}= require("../components/Auth")
const {login,logout,addflight,deleteflight,addairport} = require("../components/admin")

const AdminRouter=express.Router()

// AdminRouter.post("/signup",CatchAsync(async (req,res,next)=>{
//     const obj={}
//     obj["username"]=req.body.username
//     obj["email"]=req.body.email
//     obj["password"]=req.body.password
//     obj["conformpassword"]=req.body.conformpassword
//     obj["role"]=req.body.role

//     const data = await User.create(obj)

//     const token = jwt.sign({id:data._id},process.env.JSON_SECRET,{expiresIn:process.env.JSON_EXP})

//     res.status(201).send({
//         status:"success",
//         token,
//         data
//     })
// }))

AdminRouter.post("/login",login)

AdminRouter.get("/logout",protectionadmin,logout)

AdminRouter.post("/flight",protectionadmin,addflight)

AdminRouter.get("/booked", protectionadmin,booking)

AdminRouter.delete("/flight",protectionadmin,deleteflight)

AdminRouter.post("/airport",protectionadmin,addairport)

module.exports=AdminRouter
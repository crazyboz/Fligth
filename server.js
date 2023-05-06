require("dotenv").config()
const express = require("express")
const mongoose= require("mongoose")
const AppErr=require("./ErrorHandling/App.js")
const AdminRouter=require("./Admin.js")
const app= express()

let db="mongodb+srv://dineshn20:<password>@cluster0.iv9wg6d.mongodb.net/flight?retryWrites=true&w=majority"
db=db.replace("<password>",process.env.DBPASSWORD)

//database connection
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database is connected")
}).catch((err)=>{console.log(err)})

app.use(express.json())

//Router
app.use("/admin",AdminRouter)

//no such url
app.all("*",(req,res,next)=>{
    next(new AppErr(`can't find the ${req.originalUrl} on this server`),404)
})


//error handling
app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.messagge =err.messagge || "error"
    res.status(err.statusCode).send(err.messagge)
})


//listen 
app.listen(process.env.PORT,()=>console.log("server is created....."))
require("dotenv").config()
const express = require("express")
const mongoose= require("mongoose")
const AppErr=require("./ErrorHandling/App.js")
const AdminRouter=require("./Routers/Admin.js")
const UsersRouter = require("./Routers/Users.js")
const cors = require("cors")
const app= express()


let db=process.env.DB
db=db.replace("<password>",process.env.DBPASSWORD)

//database connection
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database is connected")
}).catch((err)=>{console.log(err)})

app.use(express.json())
app.use(cors())

//Router
app.use("/admin",AdminRouter)
app.use("/user",UsersRouter)


//no such url
app.all("*",(req,res,next)=>{
    next(new AppErr(`can't find the ${req.originalUrl} on this server`,404))
})


//error handling
app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.message =err.message || "error"
    res.status(err.statusCode).send(err.message)
})


//listen 
app.listen(process.env.PORT,()=>console.log("server is created....."))
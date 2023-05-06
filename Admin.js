const express= require("express")
const CatchAsync = require("./components/Error.js")
const flightDetails = require("./schema_model/flight_details.js")

const AdminRouter=express.Router()

AdminRouter.post("/flight",CatchAsync(async (req,res)=>{
    const data = await flightDetails.create(req.body);
    res.status(200).send(data)
}))

AdminRouter.get("/flight", async (req,res)=>{
    let data 
    if(req.query.flightName){
        data = await flightDetails.find({name:req.query.flightName}).exec()
    }else if(req.query.flightTime){
        // data = flightDetails.aggregate(
        //                 [
        //                 {
        //                     $project: {
        //                     birthHour: { $dateToString: { format: "%H", date: "$takeOfTime" } }
        //                     }
        //                 }
        //                 ]
        //         )
        
        // data= await flightDetails.find().map(
        //     function(c){
        //         if(c.takeOfTime.getUTCHours() == (req.query.flightTime)){
        //             return c
        //         }
        //     }
        //   );
    }

    res.status(200).send(data)
})

AdminRouter.delete("/flight",async (req,res)=>{
    await flightDetails.findOneAndDelete({flightId:req.query.flightId}) 
    res.status(200).send({"masg":"successfully deleted"})  
})

module.exports=AdminRouter
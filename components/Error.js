const Apperr = require("../ErrorHandling/App")

module.exports = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}
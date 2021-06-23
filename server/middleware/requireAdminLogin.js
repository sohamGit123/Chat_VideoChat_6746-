const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const mongoose = require('mongoose')
const Admin=mongoose.model("Admin")

module.exports=(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        res.status(401).json({error: "you must be logged in"})
    }
    const token = authorization.replace("token ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error: "Invalid token"})
        }
        const {_id}=payload
        Admin.findById(_id).then(admindata=>{
            req.user = admindata
            next()
        })
    })
}
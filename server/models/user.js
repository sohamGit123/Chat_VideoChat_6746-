const mongoose=require("mongoose")
const {ObjectId} = mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isadmin: {
        type: Boolean
    },
    pic:{
        type: String,
        default: "https://res.cloudinary.com/codersneverquit/image/upload/v1623425684/dafaultpic_xb7s6z.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    resetToken:String,
    expireToken:Date,
    userotp:String
})

mongoose.model("User",userSchema)
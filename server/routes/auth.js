const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const Admin=mongoose.model("Admin")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const crypto=require('crypto')

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:""
    }
}))

/*router.get('/',(req,res)=>{
    res.send("Hello")
})*/

/*router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})*/

router.post('/verify',(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(422).json({error: "Please add all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "user already exist with that email"})
        }
        crypto.randomBytes(32,(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const token=buffer.toString("hex")
            transporter.sendMail({
                to:req.body.email,
                from:"sohamsarkar916@gmail.com",
                subject:"email verification",
                html:`
                    <p>You requested for email verification</p>
                    <h5>Click on this <a href="http://localhost:3000/signup/${token}/${email}">link</a> to verify email</h5>
                `
            })
            res.json({message:"Check your email"})
        })
    })
})

// router.post('/signup',(req,res)=>{
//     const {name,email,password}=req.body
//     if(!email || !password || !name){
//         return res.status(422).json({error: "Please add all fields"})
//     }
//     // res.json({message: "Successfully Posted"})
//     User.findOne({email:email})
//     .then((savedUser)=>{
//         if(savedUser){
//             return res.status(422).json({error: "user already exist with that email"})
//         }
//         bcrypt.hash(password,12)
//         .then(hashedpassword=>{
//             const user=new User({
//                 email,
//                 password: hashedpassword,
//                 name,
//                 isAdmin: false
//             })

//             user.save()
//             .then((user)=>{
//                 transporter.sendMail({
//                     to:user.email,
//                     from:"sohamsarkar916@gmail.com",
//                     subject:"Signup successful",
//                     html:"<h1>Welcome Explorer</h1>"
//                 })
//                 res.json({message: "saved successfully"})
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//         })
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })
//new one below
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!password || !name){
        return res.status(422).json({error: "Please add all fields"})
    }
    // res.json({message: "Successfully Posted"})
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                password: hashedpassword,
                name,
                pic,
                isadmin: false
            })

            user.save()
            .then((user)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"sohamsarkar916@gmail.com",
                    subject:"Signup successful",
                    html:"<h1>Welcome Explorer</h1>"
                })
                res.json({message: "saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error: "Please enter email or password"})
    }
    User.findOne({email: email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        if(savedUser.isadmin){
            return res.status(422).json({error: "Please log in as admin"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message: "successfully signed in"})
                const token=jwt.sign({_id: savedUser._id},JWT_SECRET)
                const {_id,name,email,isadmin,followers,following,pic}=savedUser
                res.json({token: token,user:{_id:_id,name:name,email:email,isadmin:isadmin,followers,following,pic}})
            }
            else{
                // console.log(password+"    "+savedUser.password)
                // console.log(doMatch)
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/getOtp',(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(422).json({error: "Please add all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error: "email id doesn't exists"})
        }
        const otp=Math.floor(Math.random()*10000)
        transporter.sendMail({
            to:req.body.email,
            from:"sohamsarkar916@gmail.com",
            subject:"OTP for user",
            html:`
                <p>You requested for OTP</p>
                <p>OTP: ${otp}</p>
            `
        })
        res.json({message:"Check your email",otp:otp})
    })
})

router.post('/admin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error: "Please enter email or password"})
    }
    User.findOne({email: email})
    .then(savedUser=>{
        console.log("user state after signing in = "+savedUser)
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        if(password==savedUser.password){
            const token=jwt.sign({_id: savedUser._id},JWT_SECRET)
            const {_id,name,email,followers,following,pic}=savedUser
            res.json({token: token,user:{_id:_id,name:name,email:email,isadmin:true,followers,following,pic}})
        }
        else{
            return res.status(422).json({error: "Invalid email or password admin"})
        }
        //res.json({message: "successfully signed in"})
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token=buffer.toString('hex')
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User don't exists with that email"})
            }
            user.resetToken=token
            user.expireToken=Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"sohamsarkar916@gmail.com",
                    subject:"password reset",
                    html:`
                        <p>You requested for password reset</p>
                        <h5>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"Check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const Newpassword=req.body.password
    const sentToken=req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(Newpassword,12).then(hashedpassword=>{
            user.password=hashedpassword
            user.resetToken=undefined
            user.expireToken=undefined
            user.save().then((savedUser)=>{
                res.json({message:"password updated success"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router

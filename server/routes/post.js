const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")
router.post('/createpost',requireLogin,(req,res)=>{
    console.log("Hello Backend")
    const {title,body,pic}=req.body
    if(!title || !body /*|| !pic*/){
      return  res.status(422).json({error: "Please add all the fields"})
    }
    req.user.password=undefined
    // if(!pic){
    //     const post=new Post({
    //         title: title,
    //         body: body,
    //         postedBy: req.user
    //     })
    // }
    
        const post=new Post({
            title: title,
            body: body,
            photo: pic,
            postedBy: req.user
        })
    
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")//sorting the posts according to timestamps
    .then(posts=>{
        //console.log(posts)
        res.json({posts: posts})
    })
    .catch(err=>{
        console.log(err)
    })
    // console.log("temp---->>>>  "+Post.find().then())
})

router.get('/myPosts',requireLogin,(req,res)=>{
    Post.find({postedBy: req.user._id})
    .populate('postedBy','_id name')
    .sort("-createdAt")//sorting the posts according to timestamps
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log("error in retreiving your posts")
    })
})

router.get('/getsubPost',requireLogin,(req,res)=>{
    Post.find({postedBy: {$in:req.user.following}})
    .populate('postedBy','_id name')
    .populate('comments.postedBy','_id name')
    .sort("-createdAt")//sorting the posts according to timestamps
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            // console.log("After Liking Post")
            // console.log(result)
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/fav',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{favourite: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/removefav',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{favourite: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/report',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{reports: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/rmvreport',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{reports: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment}
    },{
        new: true
    })
    .populate("postedBy","_id name")// Atfirst this needs to be populated.
    .populate("comments.postedBy","_id name")//   Now this should be populated.
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    // console.log("hi "+req.params.postId)
    // console.log("test "+req.user)
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(req.user.isadmin){
            post.remove()
            .then(result=>{
             res.json(result)
             }).catch(err=>{
                console.log(err)
            })
        }
        else if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
module.exports=router
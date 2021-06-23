const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")
const User=mongoose.model("User")


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.get("/manjari", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.name;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get friends (Manjari)
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      //console.log("user="+user)
      const friends = await Promise.all(
        user.following.map((friendId) => {
          //console.log("friendId="+friendId)
          return User.findById(friendId);
        })
      );
    //   console.log(typeof(friends))
    //   console.log("friends="+friends)
      let friendList = [];
      friends.map((friend) => {
        console.log("Friend")
        console.log(friend)
        console.log("pic")
        console.log(friend.name+" "+friend.pic+" "+friend._id)
        const { _id, pic, name } = friend;
        friendList.push({ _id, name, pic });
        // console.log("Interior friendlist="+JSON.stringify(friendList))
      });
    //   console.log("Exterior friendlist="+JSON.stringify(friendList))
      console.log("Friend list")
      console.log(friendList)
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get friends (Soham)
//   router.get('/allusers', function(req, res) {
//     User.find({}, function(err, users) {
//       var userMap = {};
//       users.forEach(function(user) {
//         userMap[user._id] = user;
//       });
//       res.send(userMap);  
//     })
//     .then(res=>{
//         console.log("result="+res)
//     })
//     .catch(err=>{
//         console.log(err)
//     })
//   });


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
            console.log(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
  (err,result)=>{
      if(err){
          return res.status(422).json({error:"cannot post pic"})
      }
      res.json(result)
  })
})

router.post('/search-users',(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  User.find({email:{$regex:userPattern}})
  .select("_id email")
  .then(user=>{
      res.json({user})
  }).catch(err=>{
      console.log(err)
  })
})
module.exports=router
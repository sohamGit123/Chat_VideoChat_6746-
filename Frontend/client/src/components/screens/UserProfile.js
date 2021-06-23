import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams,useHistory} from 'react-router-dom'
import axios from 'axios'

const Profile=()=>{
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const history=useHistory()
    console.log("state in user profile becomes "+JSON.stringify(state))
    //const [showFollowers,setShowFollowers]=useState(true)
    // console.log(userProfile)
    if(!state){
        function preback(){ window.history.forward(); }
        setTimeout(preback(),0);
        window.onunload=null  
    }
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"token "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result)
            // console.log("result="+JSON.stringify(result))
        })
    },[])

    const likePost=(id)=>{
        fetch('/like',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //result means the updated post
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log("result: "+JSON.stringify(result))
            // console.log("item: "+JSON.stringify(data[0]))
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const loveReact=(id)=>{
        fetch('/fav',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //result means the updated post
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const removeLoveReact=(id)=>{
        fetch('/removefav',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log("result: "+JSON.stringify(result))
            // console.log("item: "+JSON.stringify(data[0]))
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const reporting=(id)=>{
        fetch('/report',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //result means the updated post
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const withdrawing=(id)=>{
        fetch('/rmvreport',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log("result: "+JSON.stringify(result))
            // console.log("item: "+JSON.stringify(data[0]))
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const makeComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setProfile(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletepost=(postid)=>{
        fetch('/deletepost/'+postid,{
            method: "delete",
            headers: {
                Authorization: "token "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newdata={user:userProfile.user,posts:{}}
            newdata.posts=userProfile.posts.filter(item=>{
                return item._id!=result._id
            })
            setProfile(newdata)
        })
    }

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:data})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevstate)=>{
                // console.log("hi")
                // console.log(prevstate)
                // console.log(data)
                // console.log("hello")
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,data._id]
                    }
                }
            })
            //setShowFollowers(false)
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:data})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevstate)=>{
                // console.log("hi")
                // console.log(prevstate)
                // console.log(data)
                // console.log("hello")
                const newfollower=prevstate.user.followers.filter((item)=>{
                    // console.log("item="+item)
                    // console.log("item._id="+item._id)//id of any random follower in the followers array
                    // console.log("data="+JSON.stringify(data))
                    // console.log("data._id="+data._id)//id of logged in user.
                    return item != data._id//means we are selecting all the followers from the followers array except the logged in follower.
                })
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newfollower
                    }
                }
            })
            //setShowFollowers(true)
        })
    }

    const openConversation = async ()=>{
        try{
        const res= await axios.get("/conversations/"+state._id)
        
        //console.log(res.data[0].members)

        let i=0;
        let status=0;

        for(i=0;i<res.data.length;i++)
        {
            const friend= res.data[i].members.find((m)=>m!==state._id)
            console.log(friend)
            console.log(userProfile)
            if(friend === userProfile.user._id)
            {
                status=1
                history.push('/messenger')
                break;
            }
           
        }
        if(status==0){
            console.log("Conversation not found!")
            fetch('/conversations',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                    //"Authorization":"token "+localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                    senderId:state._id,
                    receiverId:userProfile.user._id
                })
            }).then(res=>{
                console.log(res.json())
                history.push('/messenger')
            })
        }
        
       
        }
        catch(err)
        {
            console.log(err)
        }
    }

    const [currentPost,setCurrentPost]=useState("")
    //console.log("state="+JSON.stringify(state))
    return (
        <>
        {!userProfile?""
        :
        <div style={{
            maxWidth: "550px", margin: "0px auto"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}}
                    src={userProfile?userProfile.user.pic:"Loading"}
                    />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h6>{userProfile.user.email}</h6>
                    <div style={{display: "flex", justifyContent: "space-between", width:"108%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} followings</h6>
                    </div>
                    <div style={{display: "flex", paddingBottom:"10px", justifyContent:"space-between"}}>
                        {
                            !state.following.includes(userProfile.user._id)
                            ?
                            <button class="btn waves-effect waves-light" onClick={()=>followUser()}>
                                Follow
                            </button>
                            :
                            <button class="btn waves-effect waves-light" onClick={()=>unfollowUser()}>
                                Unfollow
                            </button>
                        }
                        <button className="btn waves-effect waves-light"
                            onClick={openConversation}>
                            Message
                        </button>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map((item)=>{
                        return (
                            <div>
                                <div key={item._id} className="card profile-card">
                                    <h5
                                    style={{color:"grey",fontFamily:'cursive',paddingLeft:'20px',paddingTop:'10px'}}>
                                    Posted by {item.postedBy.name}
                                    {/*item.postedBy._id refers to the post id and state._id refers to the user id*/}
                                    {(item.postedBy._id==state._id || (state.isadmin && item.reports.length>0)) 
                                    && <i className="material-icons" style={{float:"right",cursor:"pointer"}}
                                    onClick={()=>{deletepost(item._id)}}
                                    >delete</i>}
                                    </h5>
                                    <div className="card-content">
                                        <h6>{item.title}</h6>
                                        <p>{item.body}</p>
                                    </div>
                                    <div className="card-image card-content">
                                        <img key={item._id} src={item.photo}/>
                                    </div>
                                    <div className="card-content">
                                        {
                                            item.favourite.includes(state._id)
                                            ?
                                            <i className="material-icons" style={{color: "red",cursor:"pointer"}} onClick={()=>{removeLoveReact(item._id)}}>favorite</i>
                                            :
                                            <i className="material-icons" style={{color: "red",cursor:"pointer"}} onClick={()=>{loveReact(item._id)}}>favorite_border</i>
                                        }
                                        <span>{item.favourite.length}    </span>
                                        {
                                            item.likes.includes(state._id)
                                            ?
                                            <i className="material-icons" style={{cursor: 'pointer'}} onClick={()=>{unlikePost(item._id)}}>thumb_up</i>
                                            :
                                            <i className="material-icons" style={{cursor: 'pointer'}} onClick={()=>{likePost(item._id)}}>thumb_up_off_alt</i>
                                        }
                                        <span>{item.likes.length}</span>
                                        {
                                            !(state.isadmin||(item.postedBy._id==state._id))
                                            ?
                                            item.reports.includes(state._id)
                                            ?
                                            <button className="btn btn-primary" style={{float:"right"}} onClick={()=>{withdrawing(item._id)}}>Reported</button>
                                            :
                                            <button className="btn btn-primary" style={{float:"right"}} onClick={()=>{reporting(item._id)}}>Report</button>
                                            :
                                            ""
                                        }
                                        <br></br>
                                        {
                                            state.isadmin
                                            ?
                                            <p>reported {item.reports.length} times</p>
                                            :
                                            ""
                                        }
                                        {
                                            (item._id==currentPost) 
                                            ?
                                            item.comments.map(record=>{
                                                return (
                                                    <h6 key={record._id}><span style={{fontWeight:"700"}}>{record.postedBy.name} </span>{record.text}</h6>
                                                )
                                            })
                                            :
                                            <p style={{fontWeight:"300"}}>Click on show below to check comments..</p>
                                        }
                                        <form onSubmit={(e)=>{
                                            e.preventDefault()
                                            makeComment(e.target[0].value,item._id)
                                            e.target[0].value=""//I added this line
                                        }}>
                                            <input type="text" placeholder="Add a comment"/>
                                            {
                                                (item._id==currentPost)
                                                ?
                                                <button type="button" class="btn btn-primary" onClick={()=>{setCurrentPost("")}}>Hide</button>
                                                :
                                                <button type="button" class="btn btn-primary" onClick={()=>{setCurrentPost(item._id)}}>Show</button>
                                            }
                                    
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        </div>
        }

        </>
    )
}

export default Profile
import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile=()=>{
    const [mypics,setpics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [image,setImage]=useState(undefined)
    // const [url,setUrl]=useState("")
    // console.log("state in profile becomes: "+JSON.stringify(state))
    // console.log("image in profile becomes: "+JSON.stringify(image))
    // console.log(mypics)
    if(!state){
        function preback(){ window.history.forward(); }
        setTimeout(preback(),0);
        window.onunload=null  
    }
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"token "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log("Result===>>>>"+JSON.stringify(result))
            // console.log("Use Effect 1 runs")
            setpics(result.myposts)
        })
    },[])

    useEffect(()=>{
        if(image){
            console.log("Use Effect 2 runs")
            const data=new FormData()
            data.append("file",image)
            data.append("upload_preset","explore-app")
            data.append("cloud_name","codersneverquit")
            fetch("https://api.cloudinary.com/v1_1/codersneverquit/image/upload",{
                method: "post",
                body: data
            })
            .then(res=>res.json())
            .then(data=>{
                // setUrl(data.url)
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url})
                console.log("inner fetch method runs")
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"token "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                    window.location.reload()//Not necessary to that extent.
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])

    const updatePhoto=(file)=>{
        setImage(file)
    }

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
            const newdata=mypics.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setpics(newdata)
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
            const newdata=mypics.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setpics(newdata)
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
            const newdata=mypics.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setpics(newdata)
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
            const newdata=mypics.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setpics(newdata)
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
            // console.log(result)
            const newdata=mypics.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setpics(newdata)
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
            // console.log(result)//Printing the deleted post in the console.
            const newData=mypics.filter(item=>{
                return item._id!=result._id
            })
            setpics(newData)
        })
    }
    const [currentPost,setCurrentPost]=useState("")
    const foo=()=>{
        console.log("JSX is rendering")
    }
    return (
        <>
        {!state?<h1>{foo()}</h1>
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
                    src={state?state.pic:"loading"}
                    />
                    <div>
                    <div className="file-field input-field" style={{margin:"10px"}}>
                        <div className="btn waves-effect waves-light">
                            <span>Update Profile Pic</span>
                            <input type="file" 
                            onChange={(event)=>updatePhoto(event.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <h4>{state?state.name:"loading..."}</h4>
                    <h6>{state?state.email:"loading..."}</h6>
                    <div style={{display: "flex", justifyContent: "space-between", width:"108%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"Loading..."} followers</h6>
                        <h6>{state?state.following.length:"Loading..."} followings</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map((item)=>{
                        return (
                            <div>
                                <div key={item._id} className="card profile-card">
                                    <h5
                                    style={{color:"grey",fontFamily:'cursive',paddingLeft:'20px',paddingTop:'10px'}}>
                                    Posted by {item.postedBy.name}
                                    {/*item.postedBy._id refers to the post id and state._id refers to the user id*/}
                                    {item.postedBy._id==state._id 
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
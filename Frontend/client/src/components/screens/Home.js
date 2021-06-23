import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home=()=>{
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    if(!state){
        function preback(){ window.history.forward(); }
        setTimeout(preback(),0);
        window.onunload=null  
    }
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization": "token " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setData(result.posts)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
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
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata)
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
            const newData=data.filter(item=>{
                return item._id!=result._id
            })
            setData(newData)
        })
    }

    const [currentPost,setCurrentPost]=useState("")
    return (
        <>
        {!state?""
        :
        <div className="home">
            {
                data.map(item=>{
                    return (
                        <div key={item._id} className="card home-card">
                            <h5 
                                style={{color:"grey",fontFamily:'cursive',paddingLeft:'20px',paddingTop:'10px'}}
                            >
                                Posted by
                                <Link 
                                to={(item.postedBy._id!=state._id)?"/profile/"+item.postedBy._id:"/profile"}>
                                <span style={{color:"grey"}}>{` ${item.postedBy.name}`}</span>
                                </Link>
                                {/*item.postedBy._id refers to the post id and state._id refers to the user id*/}
                                {(item.postedBy._id==state._id || (state.isadmin && item.reports.length>0))
                                && <i className="material-icons" style={{float:"right",cursor:'pointer'}}
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
                                <span>{item.likes.length}     </span>
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
                    )
                })
            }

        </div>
        }
        </>
    )
}

export default Home
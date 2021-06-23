import React,{useState,useEffect,useContext} from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'
const CreatePost = ()=>{
    const history=useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const {state,dispatch}=useContext(UserContext)

    if(!state){
        function preback(){ window.history.forward(); }
        setTimeout(preback(),0);
        window.onunload=null  
    }

    useEffect(()=>{
        if(url=="empty"){
            console.log("hello")
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":"token "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Posted successfully",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else if(url){
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":"token "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Posted successfully",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[url])

    const postDetails=()=>{
        if(!image){
            console.log("Upload an image")
            setUrl("empty")
        }
        else{
            console.log("Yeah image is uploading")
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
                setUrl(data.url)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

   return(
    <>
    {!state?""
    :
       <div className="card input-filed"
       style={{
           margin:"10px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}>
           <input type="text" placeholder="title" 
           onChange={(event)=>setTitle(event.target.value)}
           value={title}
           />
           <input type="text" placeholder="body"
           value={body}
           onChange={(event)=>setBody(event.target.value)}
           />
           <div className="file-field input-field">
            <div className="btn waves-effect waves-light">
                <span>Upload Image</span>
                <input type="file" 
                onChange={(event)=>setImage(event.target.files[0])}
                />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>

            <button className="btn waves-effect waves-light"
            onClick={()=>postDetails()}
            >
                Submit post
            </button>

       </div>
    }
    </>
   )
}

export default CreatePost
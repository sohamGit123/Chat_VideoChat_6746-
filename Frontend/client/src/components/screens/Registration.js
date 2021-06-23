import React,{useEffect, useState} from 'react'
import {Link, useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Registration=()=>{
    const history=useHistory()
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    // const [email,setEmail]=useState("")
    const {token,email}=useParams()
    useEffect(()=>{
        if(url){
            UploadFields()
        }
    },[url])
    const uploadPic=()=>{
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
    const UploadFields=()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email!=""){
            M.toast({html: "invalid email",classes: "#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url,
                isadmin:false,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                //console.log(data)
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const PostData=()=>{
        if(image){
            uploadPic()
        }
        else{
            UploadFields()
        }
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2 style={{color: "rgb(95,158,160)"}}>Explore</h2>
                <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                {/* <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/> */}
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
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
                <button class="btn waves-effect waves-light" onClick={PostData}>
                    Save
                </button>
                <p>
                    <Link to='/signin'><p style={{color: "rgb(72,72,72)"}}>Already have an account?</p></Link>
                </p>
            </div>
        </div>
    )
}

export default Registration
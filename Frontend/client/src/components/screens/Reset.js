import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Reset=()=>{
    const history=useHistory()
    const [email,setEmail]=useState("")
    const PostData=()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email!==""){
            M.toast({html: "invalid email",classes: "#c62828 red darken-3"})
            return
        }
        fetch("/reset-password",{
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                //history.push('/signin')
            }
        })
        .catch(err=>{
            console.log("hello world soham sarkar "+err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2 style={{color: "rgb(95,158,160)"}}>Explore</h2>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button class="btn waves-effect waves-light" onClick={PostData}>
                    Reset Password
                </button>
            </div>
        </div>
    )
}

 export default Reset
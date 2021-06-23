import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'
const Admin=()=>{
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const [defaultEmail,setDefaultEmail]=useState("")
    const [isverified,setVerification]=useState(false)
    const [otp,setOtp]=useState("")
    const [emailOTP,setEmailOTP]=useState("")
    const PostData=()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email!==""){
            M.toast({html: "invalid email",classes: "#c62828 red darken-3"})
            return
        }
        fetch("/admin",{
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const verifyDetails=()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email!==""){
            M.toast({html: "invalid email",classes: "#c62828 red darken-3"})
            return
        }
        fetch('/getOtp',{
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
               email: email 
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                setEmailOTP(data.otp)
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Please check your email",classes:"#43a047 green darken-1"})
            }
        })
    }

    const verifyOTP=()=>{
        if(emailOTP==otp){
            setDefaultEmail(email)
            console.log(email+" "+defaultEmail)
            setVerification(true)
            M.toast({html:"OTP Verified",classes:"#43a047 green darken-1"})
        }
        else{
            M.toast({html: "Wrong OTP",classes:"#c62828 red darken-3"})
        }
    }

    function preback(){ window.history.forward(); }
    setTimeout(preback(),0);
    window.onunload=null  


    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2 style={{color: "rgb(95,158,160)"}}>Explore</h2>
                <input type="text" placeholder="email" value={!isverified?email:defaultEmail} onChange={(e)=>setEmail(e.target.value)}/>
                <button class="btn waves-effect waves-light" onClick={verifyDetails}>Get OTP</button>
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} />
                <button class="btn waves-effect waves-light" onClick={verifyOTP}>Verify OTP</button>
                <input type="password" placeholder="password" value={isverified?password:""} onChange={(e)=>setPassword(e.target.value)}/>
                <button class="btn waves-effect waves-light" onClick={PostData}>
                     Admin Login
                </button>
                <p>
                     <Link to='/signup'><p style={{color: "rgb(72,72,72)"}}>Don't have an account?</p></Link>
                </p>
                <p>
                     <Link to='/signin'><p style={{color: "rgb(72,72,72)"}}>Sign in as user?</p></Link>
                </p>
                <p>
                    <Link to='/reset'><p style={{color: "rgb(72,72,72)"}}>Forgot Password?</p></Link>
                </p>
            </div>
        </div>
    )
}

 export default Admin
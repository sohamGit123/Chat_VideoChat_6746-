import React,{useContext,useState,useEffect} from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import './Message.css'
import {format} from 'timeago.js'

function Message({message,own,current}) {
    // const [receiver,setreceiver]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const [pic,setpic]=useState(undefined)
    const receiverId=current.members.find((memberID)=>memberID!==state._id)
    console.log(receiverId)
    // let receiver=""
    // console.log(receiverId)

    useEffect(
        ()=>{
            fetch('/manjari?userId=' + receiverId)
            .then(res=>res.json())
            .then(result=>{
                setpic(result.pic)
            })
            // setpic(res.data.pic)
            // console.log(pic)
        },[pic])

    
    // useEffect(()=>{
    //     const getUser = async () =>{
    //         try{
    //         const res= await axios("/manjari?userId=" + receiverId)
    //         // console.log(res.data)
    //         setreceiver(res.data)
    //         // console.log(receiver.pic)
    //         }
    //         catch(err)
    //         {
    //             console.log(err)
    //         }
    //     }
    //     getUser();
    // },[receiver])

    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={own?(state?.pic):pic}
                    alt=""
                />
                <p className="messageText">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}

export default Message

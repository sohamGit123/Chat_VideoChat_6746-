import axios from 'axios'
import React,{useState,useEffect} from 'react'
import './ChatOnline.css'

function ChatOnline({onlineUsers, currentId, setCurrentChat}) {

    const [friends,setFriends]=useState([])
    const [onlineFriends,setOnlineFriends]=useState([])

    useEffect(()=>{
        const getFriends=async()=>{
            try{  
            const res=await axios.get("/friends/" + currentId)
            setFriends(res.data)
            console.log(res)
            }
            catch(err){
                console.log(err)
            }
        }  
        getFriends();      
    },[currentId]);

    // console.log(friends)
    // console.log(currentId)

    useEffect(()=>{
        setOnlineFriends(friends.filter((f)=>onlineUsers?.includes(f._id)))
    },[friends,onlineUsers]);

    console.log(onlineUsers)
    console.log(onlineFriends)

    return (
        <>
        {!currentId?<h1></h1>
        :
        <div className="chatOnline">
            {onlineFriends.map((o)=>(
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img 
                    className="chatOnlineImg"
                    src={o.pic}
                    alt="" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{o?.name}</span>
            </div>
            ))}
        </div>
        }
        </>
    )
}

export default ChatOnline

import './Conversations.css'
import axios from 'axios'
import {useState,useEffect} from 'react'

const Conversations=({conversation,currentUser})=>{
    const [user,setUser]=useState(null)

    useEffect(()=>{
        const friendId=conversation.members.find((m)=>m!==currentUser._id)

        const getUser = async () =>{
            try{
            const res= await axios("/manjari?userId=" + friendId)
            setUser(res.data)
            //console.log(res.data.name)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getUser();
    },[currentUser,conversation])

    //console.log(user)
    return(
        
        <div className="conversation">
            <img className="conversationImg"
                src={user?.pic}
                alt=""
            />
            <span className="conversationName">{user?.name}</span>
        </div>
    )
}

export default Conversations
import React,{useState} from 'react'
import './Messenger.css'
import Conversations from '../Conversations/Conversations'
import Message from '../Message/Message'
import ChatOnline from '../ChatOnline/ChatOnline'
import {UserContext} from '../../App'
import {useContext,useEffect,useRef} from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'

const Messenger=()=>{
    const [conversations,setConversation]=useState([])
    const [currentChat,setCurrentChat]=useState(null)
    const [messages,setMessage]=useState([])
    const [newMessage,setNewMessage]=useState("")
    const [arrivalMessage,setArrivalMessage]=useState(null)
    const [onlineUsers,setOnlineUsers]=useState([])
    const socket=useRef()
    const {state,dispatch}=useContext(UserContext)
    const scrollRef=useRef()

    // console.log("state in messenger becomes: "+JSON.stringify(state))

    useEffect(()=>{
        socket.current=io("ws://localhost:8900");
        //Copy pasted from commented section below
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
              sender: data.senderId,
              text: data.text,
              createdAt: Date.now(),
            });
        });
        //Above code copy pasted from commented section below
    },[]);

    useEffect(()=>{
        arrivalMessage && 
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessage((prev)=>[...prev,arrivalMessage]);
    },[arrivalMessage,currentChat]);

    useEffect(()=>{
        socket.current.emit("addUser",state?._id)
        socket.current.on("getUsers",users=>{
            setOnlineUsers(state?.following.filter(f=>users?.some(u=>u.userId===f)))
        })
    },[state])


    useEffect(()=>{
        const getConversations = async ()=>{
            try{
            const res= await axios.get("/conversations/"+state._id)
            setConversation(res.data)
            //console.log(state._id)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getConversations();
    },[state?._id])
    /*const {user}=useContext(UserContext)
    console.log(JSON.stringify(user))*/
    useEffect(()=>{
        const getMessages = async () => {
            try{
                const res=await axios.get("/messages/" + currentChat?._id)
                setMessage(res.data)
            }
            catch(err){
                console.log(err)
            }
        };
        getMessages();
    },[currentChat])

    
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const message={
            sender: state._id,
            text: newMessage,
            conversationId : currentChat._id,
        };

        const receiverId= currentChat.members.find(member=> member!==state._id);

        socket.current.emit("sendMessage",{
            senderId: state._id,
            receiverId,
            text: newMessage,
        })
        try{
            const res=await axios.post("/messages",message);
            setMessage([...messages,res.data]);
            setNewMessage("");
        }
        catch(err)
        {
            console.log(err);
        }
    };

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    
    //Commented for testing purpose
    // useEffect(()=>{
    //    socket.current.on("getMessage",data=>{
    //     setArrivalMessage({
    //         sender: data.senderId,
    //         text: data.text,
    //         createdAt: Date.now(),
    //     })
    //    })
    // },[])

    return(
        <>
        {!state?<h1>LOADING...</h1>
        :
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {conversations.map(c=>(
                        <div onClick={()=>setCurrentChat(c)}>
                            <Conversations conversation={c} currentUser={state}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        currentChat ? (
                    <>
                    <div className="chatBoxTop">
                        {messages.map((m)=>(
                            <div ref={scrollRef}>
                                <Message message = {m} own={m.sender===state._id} current={currentChat}/>
                            </div>
                        ))}
                        
                    </div>
                    <div className="chatBoxBottom">
                        <textarea 
                        className="chatMessageInput" 
                        placeholder="write something..."
                        onChange={(e)=>setNewMessage(e.target.value)}
                        value={newMessage}
                        ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                    </div>
                    </>
                    ) :(
                         <span className="noConversationText">
                             Open a conversation to start a chat
                         </span>
                         )}
                </div>        
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline 
                    onlineUsers={onlineUsers} 
                    currentId={state?._id}
                    setCurrentChat={setCurrentChat}
                    />
                </div>
            </div>
        </div>
        }
        </>
    )

}

export default Messenger
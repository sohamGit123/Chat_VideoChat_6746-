const io=require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:3000",
    },
});

let users=[];

const addUser=(userId,socketId)=>{
    console.log("Adding user")
    !users.some((user)=>user.userId===userId) &&
    users.push({userId,socketId});
    users.map(u=>{
        console.log("user="+JSON.stringify(u))
    })
}

const removeUser=(socketId)=>{
    console.log("Removing user")
    users.map(u=>{
        console.log("user="+JSON.stringify(u))
    })
    users=users.filter((user)=>user.socketId!==socketId)
}

const getUser=(userId)=>{
    console.log("Getting user")
    return users.find((user)=>user.userId===userId)
}

io.on("connection",(socket)=>{
    console.log("Some user has connected")

    //After every connection take socketId and userId from user
    //We use socket.on() whenever we take any event from client 
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        //sending all the users to the client by using io.emit()
        //we use io.emit() whenever we need to send any event from server to client.
        io.emit("getUsers",users)
    });

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user=getUser(receiverId)
        //Added the below if-else condition otherwise error was getting generated while sending messages to offline users.
        if(!user){
            sid=undefined
        }
        else{
            sid=user.socketId
        }
        io.to(sid).emit("getMessage",{
            senderId,
            text,
        });
    });

    socket.on("disconnect",()=>{
        console.log("some user has disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
    });
});
const { request, response } = require('express')
const express=require('express')
const app=express()
//swastik
const http = require("http")
const server=http.createServer(app)
//swastik
const mongoose=require('mongoose')
const PORT =5000
const mongo_object = require('./keys')

const conversationRoute=require("./routes/conversations")
const messageRoute=require("./routes/messages")

//Swastik
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
    console.log("Socket-2 connected")
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

//Swastik

mongoose.connect(mongo_object.MONGOURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoose")
})
mongoose.connection.on('error',(err)=>{
    console.log("error in connecting",err)
})

require('./models/user')
require('./models/admin')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.use("/conversations",conversationRoute)
app.use("/messages",messageRoute)

server.listen(PORT,()=>{
    console.log("server is running on ",PORT)
})
const express = require('express')
const mongoose = require('mongoose')
const User = require('./Router/userRouter')
const Chat = require('./Router/chatRouter')
const Message = require('./Router/messageRouter')
const {MONGO_URL} = require('./Confiq/Keys')
const PORT = process.env.PORT || 7000


const cors = require('cors')


const app = express()



mongoose.connect(MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology: true})

mongoose.connection.on('connected',()=>{
    console.log("DB connected sucessfully");
})

mongoose.connection.on('<--error from connection-->',()=>{
    console.log("DB not connected");
})  

mongoose.Promise = global.Promise

app.use(cors())
app.use(express.json())
app.use(User)
app.use(Chat)
app.use(Message)

if (process.env.NODE_ENV=="production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (request, response) => {
      response.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}


const server = app.listen(PORT,()=>{
    console.log("app initiated sucessfully at",PORT);
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{origin:"http://localhost:3000"}
})

io.on("connection",(socket)=>{
   console.log("connected on socket.io");
   socket.on('setup',(userData)=>{
     socket.join(userData._id);
     socket.emit("connected");
   })

   socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('user joined room'+ room);
   })
  
   socket.on('New Message',(newMessageReceived)=>{
      var chat = newMessageReceived.chat
      if(!chat.users) return console.log("chatb users not defined");
      chat.users.forEach((user)=>{
        if(user._id==newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received",newMessageReceived)
      })
   })
})
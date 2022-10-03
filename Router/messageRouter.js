const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const Chat = require('../Models/ChatModel')
const Message = require('../Models/MessageModel')
const requiredLogin = require('../Middleware/RequiredLogin')

router.post('/message',requiredLogin,(req,res)=>{
    const {chatId,content} = req.body
    
    if(!chatId || !content){
        res.status(401).json({errMsg:"Invalid request"})
    }else{
        const msg = {
            sender:req.user._id,
            content:content,
            chat:chatId
        }
        Message.create(msg).then(message=>{
            message.populate("sender","-password").then(result=>{
                result.populate("chat").then(newMsg=>{
                  User.populate(newMsg,{path:"chat.users",select:"name pic email"}).then(newMessage=>{
                     Chat.findByIdAndUpdate(chatId,{latestMessage:newMessage},{new:true})
                      res.send(newMessage)
                  }).catch(err=>{
                    res.send(err)
                 })
                   
                }).catch(err=>{
                    res.send(err)
                 })
            }).catch(err=>{
                res.send(err)
             })
        }).catch(err=>{
            res.send(err)
         })
    }
    
})

router.get('/message/:chatId',requiredLogin,(req,res)=>{

      const {chatId} = req.params

    Message.find({chat:chatId}).populate("sender","name pic email").populate("chat").then(result=>{
        User.populate(result,{path:"chat.users",select:"name pic email"}).then(allMessages=>{
            res.send(allMessages)
        })
    }).catch(err=>{
        res.send(err)
    })
})


module.exports = router
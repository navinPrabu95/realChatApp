const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const Chat = require('../Models/ChatModel')
const requiredLogin = require('../Middleware/RequiredLogin')


router.post('/chat', requiredLogin, (req, res) => {

    const { userId } = req.body

    if (!userId) {
        console.log("UserId param not sent with request")
    } else {
        Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "-password")
            .populate("latestMessage").then(isChat => {
                User.populate(isChat,
                    {
                        path: "latestMessage.sender",
                        select:"name pic email",
                    }).then(fineChat => {
                        if (fineChat.length > 0) {
                          res.status(200).json({result:fineChat[0]})
                        } else {
                            var chatData = {
                                chatName:"sender",
                                isGroupChat: false,
                                users: [req.user._id, userId],
                            };

                            const createdChat = Chat.create(chatData)
                            Chat.findOne({ _id: createdChat._id }).populate("users",
                                "-password").then(fullChat => {
                                    res.status(200).json({result:fullChat})
                                }).catch(err=>{
                                    res.send(err)
                                 })
                        }
                    })
            })
    }
})

router.get('/chat/fetch', requiredLogin, (req, res) => {


    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password").populate("latestMessage").populate("groupAdmin","-password").sort({ updatedAt: -1 })
        .then(result => {
            User.populate(result, {
                path: "latestMessage.sender",
                select: "name pic email",
              }).then(results=>{
                res.status(200).json({results:results})
              })
             }).catch(err => {
            res.send(err)
        })
})


router.post('/chat/group', requiredLogin, (req, res) => {
    const { chatName, members } = req.body

    if(!chatName || !members){
        res.send({ result: "Please enter all fields" })
    }

    const users = JSON.parse(members)

    if (users.length < 2) {
        res.send({ result: "The group contain atleast more than two members" })
    }

    users.push(req.user._id)

    const chat = {
        isGroupChat: true,
        chatName: chatName,
        users: users,
        groupAdmin: req.user._id
    }

    Chat.create(chat).then(groupChat => {


        Chat.find({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin","-password")
            .then(result => {
                res.status(200).json({result:result})
            }).catch(err => {
                res.send(err)
            })
    })
})

router.put('/chat/rename',requiredLogin,(req,res)=>{
    const {chatId,rename} = req.body

     Chat.findByIdAndUpdate(chatId,
        {chatName:rename},
        {new:true}) .populate("users", "-password")
        .populate("groupAdmin", "-password").exec((err,result)=>{
               if(err){
                res.send(err)
               }else{
                res.status(200).json({result:result})
               }
        })   
})

router.put('/chat/addUser',requiredLogin,(req,res)=>{

    const {chatId,userId} = req.body

    Chat.findByIdAndUpdate(chatId,
        {$push:{users:userId}},
        {new:true}) .populate("users", "-password")
        .populate("groupAdmin", "-password").exec((err,result)=>{
               if(err){
                res.send(err)
               }else{
                res.status(200).json({result:result})
               }
        })   

})

router.put('/chat/removeUser',requiredLogin,(req,res)=>{

    const {chatId,userId} = req.body

    Chat.findByIdAndUpdate(chatId,
        {$pull:{users:userId}},
        {new:true}) .populate("users", "-password")
        .populate("groupAdmin", "-password").exec((err,result)=>{
               if(err){
                res.send(err)
               }else{
                res.status(200).json({result:result})
               }
        })   

})







module.exports = router
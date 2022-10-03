const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const Schema = mongoose.Schema

const chatSchema = new Schema({
    isGroupChat:{
        type:Boolean,
        default:false
    },
    chatName:{
        type:String,
        trim:true
    },
    users:[
        {
            type:ObjectId,
            ref:'User'
        }
    ],
    latestMessage:{
        type:ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:ObjectId,
        ref:'User'
    }


},{timestamps:true})

const chat = mongoose.model('Chat',chatSchema)

module.exports = chat




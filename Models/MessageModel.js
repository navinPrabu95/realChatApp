const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender:{
        type:ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:ObjectId,
        ref:'Chat'
    }
},{timestamps:true})

const message = mongoose.model('Message',messageSchema)

module.exports = message

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:'https://res.cloudinary.com/naveen1995/image/upload/v1630736556/profile_hyfipy.jpg'
    }
},{timestamps:true})

const user = mongoose.model('User',userSchema)

module.exports = user
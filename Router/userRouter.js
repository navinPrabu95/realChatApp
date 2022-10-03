const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../Confiq/Keys')
const requiredLogin = require('../Middleware/RequiredLogin')



router.post('/signup', (req, res) => {
    const { name, password, email,pic } = req.body

    if (!name || !password || !email) {
        res.status(401).json({ errMsg: "please enter all fields" })
        console.log(name)
    } else {
        User.findOne({ email: email }).then(isEqual => {
            if (isEqual) {
                res.status(401).json({ errMsg: "Email already exist" })
            } else {
                bcrypt.hash(password, 12).then(hasedPassword => {
                    const user = new User({ name: name, password: hasedPassword, email: email,pic:pic })
                    user.save().then(user => {
                        res.status(200).json({sucessMsg:"User Created sucessfully" ,user:user })
                    })
                }).catch(err => {
                    res.status(401).json({ errMsg: "Incorrect password" })
                })
            }
        })
    }
})


router.post('/signin', (req, res) => {

    const { email, password } = req.body

    if (email && password) {
        User.findOne({ email: email }).then(existingUser => {
            if (existingUser) {
                bcrypt.compare(password, existingUser.password).then(isEqual => {
                    if (isEqual) {
                        const token = JWT.sign({ _id: existingUser._id }, JWT_SECRET_KEY)
                        res.status(200).json({ sucessMsg: "Loggedin sucessfully" ,token:token,user:existingUser })
                    } else {
                        res.status(401).json({ errMsg: "Password invalid" })
                    }
                })
            } else {
                res.status(401).json({ errMsg: "Invalid email" })
            }
        })
    } else {
        res.status(401).json({ errMsg: "please enter all fields" })
    }

})

router.get('/user/:keyword',requiredLogin,(req,res)=>{

    const {keyword} = req.params

    const keywords = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

    User.find(keywords).find({ _id: { $ne: req.user._id } }).then(result=>{
        res.send(result)
    }).catch(err=>{
        console.log(err);
    })
})

router.put('/user/update',requiredLogin,(req,res)=>{
     const {updateUrl} = req.body
     
     User.findByIdAndUpdate(
        {_id:req.user._id},
        {pic:updateUrl},{new:true}).exec((err,result)=>{
               if(err){
                res.send(err)
               }else{
                res.status(200).json({result:result})
               }
        })   
})



module.exports = router
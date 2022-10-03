const express = require('express')
const User = require('../Models/UserModel')
const JWT = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../Confiq/Keys')


module.exports = (request,response,next)=> {
    
   const{authorization} = request.headers

   if(!authorization){
       return response.send({errorMsg:'you should login first'})
   }else{
      const token = authorization.replace("Bearer ","")

      JWT.verify(token,JWT_SECRET_KEY,(err,payload)=>{

        if(err){
           return response.send({errorMsg:'you should login first'})
        }else{

          const{_id} = payload
          User.findById(_id).then(userData=>{
              request.user = userData
              next()
          })
        }
      })

   }

}

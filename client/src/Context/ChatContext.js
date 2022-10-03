import React,{createContext, useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'


const stateContext = createContext()

const  ChatContext=({children})=> {

  const [userInfo,setUserInfo] = useState()
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const Navigate = useNavigate()


  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem('user'))
       setUserInfo(user)
       if(!user){
         Navigate('/')
       }
  },[Navigate])

  return (
    <stateContext.Provider 
    value={{userInfo,setUserInfo,
           selectedChat, setSelectedChat,
           chats, setChats}}>
         {children}
    </stateContext.Provider>
  )
}

export const ChatState =()=>{
    return useContext(stateContext)
}

export default ChatContext
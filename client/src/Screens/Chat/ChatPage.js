import React, { useState } from 'react'
import {ChatState} from '../../Context/ChatContext'
import ChatDisplay from '../ChatDisplay/ChatDisplay'
import ChatHeader from '../ChatHeader/ChatHeader'
import './ChatPage.css'

function ChatPage() {

    const {userInfo,chats,selectedChat} = ChatState()

    const [fetchAgain,setFetchAgain] = useState(false)
    
  return (
    <div className='chat-container'>
        <div className={selectedChat?'chat-user-select':'chat-user-uselect'}>
          {userInfo && <ChatHeader fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
          </div>
       <div className={selectedChat?'chat-content-select':'chat-content-uselect'}>
          {userInfo ? <ChatDisplay fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> :"Loading" }
        </div> 
    </div>
  )
}

export default ChatPage
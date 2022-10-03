import React, { useState,createRef } from 'react'
import { ChatState } from '../../Context/ChatContext'
import './ChatDisplay.css'
import { Spinner } from 'react-bootstrap'
import {BiArrowBack} from 'react-icons/bi'
import {FaUserCircle} from 'react-icons/fa'
import Messages from '../Messages/Messages'
import { GetUser,GetSender } from '../../Config/ChatLogics'
import ChatInfoModal from '../Modals/ChatInfoModal'

const ChatDisplay = ({fetchAgain,setFetchAgain}) => {

  const { selectedChat,setSelectedChat,userInfo} = ChatState()

  return (
    <div className='chat-main'>
      <div className='chat-main-header'>
        <div id='back'><span onClick={selectedChat?()=>{setSelectedChat('')}:''}><BiArrowBack/></span></div>
        <div className='chat-header-2'>
          {
            selectedChat?
            <>
            <div style={{flexBasis:'20%'}}>{selectedChat && !selectedChat.isGroupChat ?<img src={GetUser(userInfo,selectedChat)} className='user-image'></img>:<FaUserCircle/>}</div>
            <div style={{flexBasis:'80%'}}>{selectedChat && !selectedChat.isGroupChat ?<h5>{GetSender(userInfo,selectedChat.users)}</h5>:<h5>{selectedChat.chatName}</h5>}</div>
            </> : <p>Loading...</p>
          } 
         </div>
        <div className='chat-header-3'>
          {selectedChat && <ChatInfoModal />}
        </div>
      </div>
      <div className='chat-main-body'>
            {selectedChat?<Messages fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>:<Spinner animation="border" className='message-spinner'/>}
      </div>
    </div>
  )
}

export default ChatDisplay
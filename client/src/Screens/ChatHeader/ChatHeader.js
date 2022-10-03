import React, { useEffect, useMemo, useState } from 'react'
import {  FaUserAlt} from 'react-icons/fa';
import { GoKebabVertical } from 'react-icons/go';
import { MdNotifications } from 'react-icons/md';
import './ChatHeader.css'
import { Spinner} from 'react-bootstrap';
import { ChatState } from '../../Context/ChatContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GetSender, GetUser } from '../../Config/ChatLogics';
import ProfileModal from '../Modals/ProfileModal';
import SearchModal from '../Modals/SearchModal';
import GroupChatModal from '../Modals/GroupChatModal';



const ChatHeader = ({fetchAgain,setFetchAgain}) => {

    const [user, setUser] = useState()

    const { userInfo, selectedChat, setSelectedChat, chats, setChats } = ChatState()

    const [view, setView] = useState(false);

    const Navigate = useNavigate()

    useEffect(() => {
        setUser(userInfo)
        fetchChat()
    },[selectedChat,fetchAgain])
     

    const fetchChat = async() => {

      const{ data} =  await axios.get("http://localhost:7000/chat/fetch",{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
       
        setChats(data.results);
    }
   


    const renderChat = useMemo(()=>{
        return chats ? chats.map((chat,i) => {
            return (<div key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={selectedChat === chat ? 'selectedChat' : 'not-selected'}>
                <div className='chat-user-main'>
                    <div className='chat-profile-pic'>
                        {
                            <img src={!chat.isGroupChat ? GetUser(userInfo, chat?.users):require('../../Images/groupIcon.png')} className='chat-users-image'></img> 
                        }
                    </div>
                    <div className='chat-profile-name'>
                        <div><p>{!chat.isGroupChat ? GetSender(userInfo, chat?.users) : chat.chatName}</p></div>
                        {chat.latestMessage && 
                           <div className='latestMessage-content'>
                              <div><p>{!chat.isGroupChat && chat.latestMessage.sender.name}:
                                  {!chat.isGroupChat && chat.latestMessage.content}</p>
                                </div>
                          </div>}
                    </div>
                </div>
            </div>)
        }) :<Spinner animation="border" />
    },[chats,fetchAgain])

    const setLogout = () => {
        localStorage.removeItem('user')
        Navigate('/')
    }

    return (
        <div className='chat-header'>
            <div className='chat-profile'>
                <div className='chat-profile1'>
                    {user ?
                        <ProfileModal user={user} setUser={setUser} /> : <FaUserAlt />}
                </div>
                <div className='chat-profile2'>
                    <h3>{user && user.name}</h3>
                </div>
                <div className='chat-profile3'>
                    <h3><GoKebabVertical onClick={() => { setView(!view) }} /></h3>
                    <ul className={view ? 'menuOn' : 'menuOff'}>
                        <li>{<GroupChatModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>}</li>
                        <li onClick={setLogout}>Logout</li>
                    </ul>
                </div>
                <div className='chat-profile4'>
                    <h3><MdNotifications /></h3>
                </div>
            </div>
            <div className='search-user'>
                <SearchModal/>
            </div>
            
            <div className='chat-users'>
               {chats ? renderChat:<Spinner animation="border" />} 
            </div>
        </div>
    )
}

export default ChatHeader
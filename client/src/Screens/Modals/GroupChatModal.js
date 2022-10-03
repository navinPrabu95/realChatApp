import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatContext';
import { FaTruckLoading, FaSearch } from 'react-icons/fa'
import { TiDelete} from 'react-icons/ti'
import { Spinner, Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Modal.css'
import {toast} from 'react-toastify'





const GroupChatModal = ({fetchAgain,setFetchAgain}) => {

    const { selectedChat, chats, setChats } = ChatState()

    const [show, setShow] = useState(false);

    const [searchResult, setSearchResult] = useState([]);

    const [groupUsers, setGroupUsers] = useState([]);

    const [chatName, setChatName] = useState("");

    const [userIds, setUserIds] = useState([]);




    const searchUser = (e) => {
        if (e.target.value === '') {
            return;
        }

        axios.get(`/user/${e.target.value}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(result => {
            setSearchResult(result.data.slice(0,3));
        }).catch(err => {
            console.log(err.data);
        })

    }

    const addUserGroup=(user)=>{
        setUserIds([...userIds,user._id])
        setGroupUsers([...groupUsers,user])
    }

    const handleDelete = (delUser) => {
        setGroupUsers(groupUsers.filter((sel) => sel._id !== delUser._id));
        toast.success("User Deleted Sucessfully")
      };

    const createGroupChat = () => { 
         
        if(!chatName && !userIds){
            console.log("Please enter All fields");
        }else{
            axios.post("/chat/group",
        {chatName:chatName,members:JSON.stringify(userIds)},
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`,
            } }).then(result=>{
                setChats([...chats,result.data])
                setShow(false)
                setFetchAgain(!fetchAgain)
            }).catch(err=>{
                console.log(err);
            })
        }   
    }


    return (
        <>
            <p onClick={() => { setShow(true) }}>New Group Chat</p>
            <Modal show={show} onHide={()=>{setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>New Group Chat</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div>
                        <input placeholder='Enter chat Name' onChange={(e)=>{setChatName(e.target.value)}}></input>
                    </div>
                    <div style={{display:'flex'}}>
                        <input type="text" placeholder="Search.." name="search" onChange={searchUser} style={{ flexBasis: '90%' }} />
                        <button type="submit" style={{ flexBasis: '10%' }}><FaSearch /></button>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap'}}>
                        {groupUsers ? groupUsers.map((user, i) => {
                            return (
                                <div  key={user._id}
                                style={{background:'purple',color:'white',width:'30%',
                                display:'flex',alignItems:'center'}} >
                                <span >{user.name}</span>
                                <TiDelete onClick={()=>handleDelete(user)}/>
                                </div>
                            )
                        }) : <FaTruckLoading />}
                    </div>
                    <div>
                        {searchResult ? searchResult.map((user, i) => {
                            return (
                                <Card key={user._id}
                                    className={selectedChat == user ? 'selectedChat' : 'not-selected'}>
                                    <Card.Body>
                                        <p onClick={()=>addUserGroup(user)}>{user.name}</p>
                                    </Card.Body>
                                </Card> 
                            )
                        }) : <FaTruckLoading />}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={createGroupChat}>
                        CreateChat
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default GroupChatModal
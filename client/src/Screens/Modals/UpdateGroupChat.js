import React, { useState, InputRef } from 'react'
import axios from 'axios';
import { TiUserAdd } from 'react-icons/ti'
import { FaEdit, FaSearch } from 'react-icons/fa'
import { Modal, Button, Spinner, Card } from 'react-bootstrap';
import { ChatState } from '../../Context/ChatContext';




const UpdateGroupChat = ({searchShow,setSearchShow}) => {

    const { selectedChat,setSelectedChat, userInfo, chats, setChats } = ChatState()

    const [searchUser, setSearchUser] = useState("");
    const [searchResult, setSearchResult] = useState([]);


    const createSearch = () => {

        axios.get(`/user/${searchUser}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(result => {
            setSearchResult(result.data.slice(0, 3));
        }).catch(err => {
            console.log(err);
        }) 
    }

    const addGroupUser = (userId) => {
        console.log("userInfo._id",userInfo._id);
        console.log("selectedChat",selectedChat);
        if(selectedChat.groupAdmin._id!==userInfo._id){
            console.log("Only Admin can access");
        }else{
            if(selectedChat.users.find(c=>c._id===userId)){
                console.log("User Already exist in the group");
            }else{
                axios.put("/chat/addUser", { chatId: selectedChat._id, userId: userId }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                  }).then(res=>{
                    console.log("User added sucessfully",res.data.result);
                    setSelectedChat(res.data.result)
                    setSearchShow(false)
                  })
            }   
        }
    }

  return (
    <>
        <Modal show={searchShow} onHide={() => setSearchShow(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <Card>
                                            <Card.Body style={{ display: 'flex' }}>
                                                <input
                                                    type="text" placeholder="Search.." name="search"
                                                    onChange={(e) => { setSearchUser(e.target.value) }} style={{ flexBasis: '90%' }} ref={InputRef} />
                                                <button type="submit" style={{ flexBasis: '10%' }} onClick={createSearch}><FaSearch /></button>
                                            </Card.Body>
                                        </Card>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{ display: 'flex', flexDirection: 'column' }}>
                                    {searchResult ? searchResult.map((u, i) => {
                                        return <div key={u._id} className='group-users-info'>
                                            <img src={u.pic} alt={u.name} className='Group-users-image'></img>
                                            <p>{u.name}</p>
                                            <TiUserAdd  onClick={()=>addGroupUser(u._id)}/>
                                        </div>
                                    }) : <Spinner animation="border" />}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary">
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
    </>
  )
}

export default UpdateGroupChat
import React, { useState, InputRef } from 'react'
import { Modal, Button, Spinner, Card } from 'react-bootstrap';
import { ChatState } from '../../Context/ChatContext';
import { GetSender } from '../../Config/ChatLogics'
import { AiFillEye } from 'react-icons/ai'
import { FaEdit,FaWindowClose} from 'react-icons/fa'
import { TiUserDelete, TiUserAdd } from 'react-icons/ti'
import UpdateGroupChat from './UpdateGroupChat';
import axios from 'axios';


const ChatInfoModal = () => {

    const { selectedChat, userInfo, chats, setChats,setSelectedChat } = ChatState()
;

    const [show, setShow] = useState(false);
    const [searchShow, setSearchShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [renameInput, setRenameInput] = useState('');



    const setRenameGroup = () => {
        axios.put("/chat/rename", { chatId: selectedChat._id, rename: renameInput }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }).then(data=>{
            setSelectedChat(data.result)
          }).catch(err=>{
            console.log(err);
          })
        setEdit(false)
    }
   
    const removeGroupUser = (userId) => {

        if(selectedChat.groupAdmin._id!==userInfo._id){
            console.log("Only Admin can access");
        }else{
            axios.put("/chat/removeUser", { chatId: selectedChat._id, userId: userId }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                  }).then(res=>{
                    console.log("User Deleted sucessfully",res.data.result);
                    setSelectedChat(res.data.result)
                    setSearchShow(false)
                  })  
        }
    }   

    return (
        <>
            {selectedChat ? <div>
                <AiFillEye onClick={() => setShow(true)} />
                <Modal show={show} onHide={() => { setShow(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ display: 'flex', width: '100%', margin: '5px auto' }}>
                            {selectedChat.isGroupChat ? <>
                              {edit ? 
                              <><input type='text' onChange={(e)=>{setRenameInput(e.target.value)}} ></input>
                              <button onClick={setRenameGroup}>ADD</button> <FaWindowClose onClick={() => setEdit(false)}/></>:
                              <>
                              <h5>{selectedChat.chatName}</h5>
                              <FaEdit onClick={() => setEdit(true)} />
                              {searchShow?<UpdateGroupChat searchShow={searchShow} setSearchShow={setSearchShow}/>:
                              <TiUserAdd onClick={() => setSearchShow(true)} />}</>
                              }       
                            </> : <h5>{GetSender(userInfo, selectedChat.users)}</h5>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modal-body'>
                        {selectedChat.isGroupChat && selectedChat.users.map((u, i) => {
                            return <div key={u._id} className='group-users-info'>
                                <img src={u.pic} alt={u.name} className='Group-users-image'></img>
                                <p>{u.name}</p>
                                <TiUserDelete onClick={() => removeGroupUser(u._id)} />
                            </div>
                        })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div> : <Spinner animation="border" />}
        </>
    )
}

export default ChatInfoModal
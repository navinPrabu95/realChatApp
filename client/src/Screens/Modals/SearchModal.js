import React, { useState,createRef } from 'react'
import {  FaSearch } from 'react-icons/fa'
import { IoMdAddCircleOutline} from 'react-icons/io'
import { Spinner, Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { ChatState } from '../../Context/ChatContext';


const SearchModal = () => {

    const { selectedChat, setSelectedChat,chats,setChats} = ChatState()

    const [searchUser, setSearchUser] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const InputRef = createRef()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const createSearch = () => {

        axios.get(`http://localhost:7000/user/${searchUser}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(result => {
            setSearchResult(result.data.slice(0,3));
        }).catch(err => {
            console.log(err);
        })
    }

    const createChat=(id)=>{
        axios.post("http://localhost:7000/chat",{userId:id}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res=>{
            if(chats.find(c=>c._id==res.data.result._id)){
                setSelectedChat(res.data.result)
            }
            setChats([...chats,res.data.result]) 
            setShow(false)
        }).catch(err=>{
            console.log(err);
        })
    }

    return (
        <>
            <Card>
                <Card.Body style={{display:'flex',width:'90%',margin:'1px auto' ,alignItems:'center'}}>
                    <h5>Add New</h5> <h5><IoMdAddCircleOutline style={{color:'red',cursor:'pointer'}} onClick={()=>{setShow(true)}}/></h5>
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                   <Modal.Title>
                        <Card>
                        <Card.Body style={{display:'flex'}}>
                            <input 
                            type="text" placeholder="Search.." name="search"
                             onChange={(e)=>{setSearchUser(e.target.value)}} style={{flexBasis:'90%'}} ref={InputRef} />
                            <button type="submit" style={{flexBasis:'10%'}} onClick={createSearch}><FaSearch /></button>
                        </Card.Body>
                    </Card>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column' }}>
                    {searchResult ? searchResult.map((user, i) => {
                        return (
                            <Card key={user._id} onClick={()=>createChat(user._id)} 
                             className={selectedChat===user?'selectedChat':'not-selected'}>
                                <Card.Body>
                                    <p>{user.name}</p>
                                </Card.Body>
                            </Card>
                        )
                    }) : <Spinner animation="border" />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SearchModal
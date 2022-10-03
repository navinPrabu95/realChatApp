import React, { useEffect, useMemo, useState, createRef } from 'react'
import { ChatState } from '../../Context/ChatContext';
import axios from 'axios';
import { Card, FloatingLabel, Form, Spinner } from 'react-bootstrap'
import { AiOutlineSend } from 'react-icons/ai'
import { SameUser } from '../../Config/ChatLogics'
import './Messages.css'
import io from 'socket.io-client'


const ENDPOINT = "http://localhost:7000";
var socket, selectedChatCompare;

const Messages = ({fetchAgain,setFetchAgain}) => {

  const { selectedChat, userInfo } = ChatState()

  const [socketConnected, setsocketConnected] = useState(false)

  const InputRef = createRef()

  const [inputs, setInputs] = useState()

  const [messageData, setMessageData] = useState([])


  const fetchChat = (selectedChat) => {
    if (selectedChat) {
      axios.get(`http://localhost:7000/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }).then(result => {
        setMessageData(result.data)
        socket.emit('join chat', selectedChat._id)
      }).catch(err => {
        console.log(err.data);
      })
    }
  }

  const MessageInput = (e) => {
    setInputs(e.target.value);
  }


  const SubmitMessages = () => {

    axios.post("http://localhost:7000/message", { chatId: selectedChat._id, content: inputs }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }).then(res => {
      setMessageData([...messageData, res.data]);
      InputRef.current.value = ""
      socket.emit('New Message', res.data)
      setFetchAgain(!fetchAgain)
    }).catch(err => {
      console.log(err.data);
    })
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo)
    socket.on('connection', () => {
      setsocketConnected(true)
    })
  }, [])

  useEffect(() => {
    fetchChat(selectedChat)
    selectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        //  give Notofication
      } else {
        setMessageData([...messageData, newMessageReceived])
      }
    })
  })



  const MessageRender = useMemo(() => {
             return messageData.map((m, i) => {
      return <div key={m._id} className={!m.isGroupChat && SameUser(m.sender._id, userInfo._id)}>
              <p>{m.content}</p>
             </div>
           })      
  }, [messageData,selectedChat])

  return (
    <div className='single-chat-messages'>
      <div className='chat-main-messages'>
        <>
        {messageData.length > 0 ?
           messageData? MessageRender: <Spinner animation="border" style={{ margin: '10px 10px' }} /> 
          : <h3>Loading....</h3>} </>
      </div>
      <div className='chat-main-input'>
        <Card>
          <Card.Body style={{ backgroundColor: 'lightblue' }}>
            <FloatingLabel
              controlId="floatingTextarea"
              className="mb-3"
              style={{ display: 'flex' }}
            >
              <Form.Control type="Text" placeholder="Enter your message" className='input-field' onChange={MessageInput} ref={InputRef} />
              <button className='send-button' onClick={SubmitMessages}><AiOutlineSend /></button>
            </FloatingLabel>
          </Card.Body>
          
        </Card>
      </div>
    </div>
  )
}

export default Messages
import axios from 'axios';
import React, { useState,createRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Signin.css'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function SignIn() {
  
  const [loginData, setLogindata] = useState({email: "", password: ""})

  const emailRef = createRef()
  const passwordRef = createRef()
  const Navigate = useNavigate()

  const getInput = (e) => {
    
      setLogindata({ ...loginData, [e.target.name]: e.target.value })
    
  }

  const submitData=(e)=>{

      e.preventDefault()
      
      axios.post("/signin",{email: loginData.email, password: loginData.password})
      .then(result=>{
        const {token,user,sucessMsg} = result.data
        toast.success(sucessMsg, {
          position: toast.POSITION.TOP_RIGHT
      })
        localStorage.setItem("user",JSON.stringify(user))
        localStorage.setItem("token",token)
        reference()
        Navigate('/chat')
      }).catch(err=>{
        console.log(err);
      })
  }

  const reference=()=>{
    emailRef.current.value = ''
    passwordRef.current.value = '' 
  }

  return (
    <div className='input-group'>
              <ToastContainer />

      <div className='form' onSubmit={(e) => { submitData(e) }}>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email </Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" onChange={getInput} ref={emailRef} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" onChange={getInput} ref={passwordRef} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default SignIn
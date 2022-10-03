import React, { createRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import './Signin.css'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



function SignUp() {

  const [loginData, setLogindata] = useState({ name: "", email: "", password: "", pic: "" })


  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const picRef = createRef()



  const getInput = (e) => {
    if (e.target.name === 'pic') {
      setLogindata({ ...loginData, [e.target.name]: e.target.files[0] })
    } else {
      setLogindata({ ...loginData, [e.target.name]: e.target.value })
    }
  }

  const submitData = async (e) => {
    e.preventDefault()
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!reg.test(String(loginData.email))) {

      toast.error("email error")

   }else{
    const regPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/

            if (!regPass.test(String(loginData.password))) {

                toast.error("password characteristics failed")

            }else{
              const fData = new FormData()
              fData.append('file', loginData.pic)
              fData.append('upload_preset', 'realChat')
              fData.append('cloud_name', 'naveen1995')
              const { data } = await axios.post("https://api.cloudinary.com/v1_1/naveen1995/image/upload", fData)
          
              axios.post("http://localhost:7000/signup", { name: loginData.name, email: loginData.email, password: loginData.password, pic: data.url })
                .then(result => {
                  toast.success(result.data.sucessMsg, {
                    position: toast.POSITION.TOP_RIGHT
                })
                  reference()
                }).catch(err => {
                  console.log(err);
                })
            }
            }
   }
    

  const reference=()=>{
    nameRef.current.value = ''
    emailRef.current.value = ''
    passwordRef.current.value = ''
    picRef.current.value = ''
  }

  return (
    <div className='input-group'>
        <ToastContainer />
      <div className='form'>
        <Form onSubmit={(e) => { submitData(e) }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter name" onChange={getInput} ref={nameRef} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email </Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" onChange={getInput} ref={emailRef} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" onChange={getInput} ref={passwordRef} required />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Pic</Form.Label>
            <Form.Control type="file" name="pic" onChange={getInput} ref={picRef} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default SignUp
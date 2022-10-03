import React, { useState,createRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa'
import axios from 'axios'


const ProfileModal = ({ user,setUser }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const [imageUrl , setImageUrl] = useState()

    const imageRef = createRef()

    const updateProfile = async() => {
        const fData = new FormData()
        fData.append('file', imageUrl)
        fData.append('upload_preset', 'realChat')
        fData.append('cloud_name', 'naveen1995')
        const { data } = await axios.post("https://api.cloudinary.com/v1_1/naveen1995/image/upload", fData)

      axios.put('http://localhost:7000/user/update',{updateUrl:data.url},{
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        }).then((res)=>{
            setUser(res.data.result);
        }).catch(err=>{
            console.log(err);
        })
         
    }

    return (
        <>
            {user ?

                <img src={user.pic} alt={user.name} onClick={() => { setShow(true) }} className='profile-img'>
                </img> : <span>Profile</span>}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{user ? user.name : 'Profile'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column' }}>
                    {user ? <img src={user.pic} style={{ width: '100%', margin: '10px auto' }}></img> : 'Profile'}
                    <div>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label
                            style={{ display: 'flex', width: '80%', alignItems: 'center', margin: '1px auto'}}> 
                            <h3>Edit Profile</h3></Form.Label>
                            <Form.Control type="file" onChange={(e)=>{setImageUrl(e.target.files[0])}} ref={imageRef}/>
                        </Form.Group>
                        <button onClick={updateProfile}>Update</button>
                        </div>
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

export default ProfileModal
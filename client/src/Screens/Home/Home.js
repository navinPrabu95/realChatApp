import React, { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import './Home.css'


function Home() {

  const [toggle ,setToggle ] =  useState(true)

  
  return (
    <div className='home'>
         <div className='home-container'>
             <div className='button-groups'>
                   <button className='toggle-btn' style={{backgroundColor: toggle ? 'orange' : '', 
                    color: toggle ? 'white' : ''}} onClick={()=>setToggle(true)}>Login</button>

                   <button className='toggle-btn' style={{ backgroundColor: toggle ? '':'orange',
          color: toggle ? '' :'white'}} onClick={()=>setToggle(false)}>Register</button>
             </div>
             <div className='component-groups'>
                {toggle?<SignIn/>:<SignUp/>}
             </div>
         </div>
    </div>
  )
}

export default Home
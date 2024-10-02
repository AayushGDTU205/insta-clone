import React, { useState } from 'react'
import instance from '../utils/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { FloatingLabel, Form } from 'react-bootstrap';
import styles from './SignUp.module.css';
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [bio, setBio] = useState('');
    const [profile, setProfile] = useState();
    const navigate = useNavigate();
    const SignUpHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);
        formData.append('fullname', fullname);
        formData.append('bio', bio);
        formData.append('profile', profile);

        console.log(profile);
        try {
            const response = await instance.post('/signup',formData,{headers: {'Content-Type': 'multipart/form-data'}});
            console.log(response);
            navigate('/login');
        } catch (error) {
            alert(error.response.data.message);
        }
    }
  return (
      <div className={styles['signup-page']}>
      <form onSubmit={SignUpHandler} className={styles['input-form']}>
      <h2 style={{textAlign:'center'}}>User Sign Up</h2><br/>
      <FloatingLabel style={{width:'80%'}} 
        controlId="floatingInput"
            label="Email"
            className="custom-floating-label mb-3"
      >
            <Form.Control onChange={e=>setEmail(e.target.value)} type="email" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel style={{width:'80%'}} 
        controlId="floatingInput"
            label="Username"
            className="custom-floating-label mb-3"
      >
            <Form.Control onChange={e=>setUsername(e.target.value)} type="text" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel style={{width:'80%'}} 
        controlId="floatingInput"
            label="Full Name"
            className="custom-floating-label mb-3"
      >
            <Form.Control onChange={e=>setFullname(e.target.value)}type="text" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel style={{width:'80%'}} 
        controlId="floatingPassword"
            label="Password"
            className="custom-floating-label mb-3"
      >
            <Form.Control onChange={e=>setPassword(e.target.value)} type="password" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel style={{width:'80%'}} 
        controlId="floatingInput"
            label="Bio"
            className="custom-floating-label mb-3"
      >
            <Form.Control onChange={e=>setBio(e.target.value)} type="text" placeholder="name@example.com" />
      </FloatingLabel>
            {/* <input onChange={e=>setEmail(e.target.value)} type='text' placeholder='Enter Email'></input> <br/> 
            <input onChange={e=>setUsername(e.target.value)} type='text' placeholder='Enter Username'></input>  <br/>
            <input onChange={e=>setFullname(e.target.value)} type='text' placeholder='Enter Full Name'></input>  <br/>
            <input onChange={e=>setPassword(e.target.value)} type='password' placeholder='Enter Password'></input>  <br/>
            <input onChange={e=>setBio(e.target.value)} type='text' placeholder='Enter Bio'></input>  <br /> */}
            <input onChange={e=>setProfile(e.target.files[0])} type='file' placeholder='Upload Profile Image'></input>
          <button type='submit' className={styles['submit-btn']}>Sign Up</button>
          <NavLink to="/login">Already have an account? Login</NavLink>
          </form>
          
    </div>
  )
}

export default SignUp
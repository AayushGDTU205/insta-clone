import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import instance from '../utils/axios';
import {  NavLink, useNavigate } from 'react-router-dom';
import { FloatingLabel, Form } from 'react-bootstrap';
import Styles from './Login.module.css';

const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const LoginHandler = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try { 
            const { data } = await instance.post('/login', { username, password });
            
            localStorage.setItem('token', data.authToken);
            dispatch({ type: 'SET_USER', payload: data.data });
            navigate('/app');
            
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }
    return (
        <div className={Styles['login-bg']}>
            <div className={Styles['login-box']}>
                <h2 style={{textAlign:'center'}}>User Login</h2><br/>
            <FloatingLabel style={{width:'80%'}} 
        controlId="floatingInput"
            label="Username"
            className="custom-floating-label mb-3"
        
      >
            <Form.Control ref={usernameRef} style={{height:'100%'}} type="email" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel style={{width:'80%'}} controlId="floatingPassword" label="Password">
        <Form.Control ref={passwordRef} type="password" placeholder="Password" />
          </FloatingLabel>
          <button className={Styles['enter-btn']} onClick={LoginHandler}>Login</button><br/>
          <NavLink to="/signup">Don't have an account? SignUp</NavLink>
            </div>

          {/* <input ref={usernameRef} type='text' placeholder='Enter Username'></input> <br/>
          <input ref={passwordRef} type='password' placeholder='Enter Password'></input> <br />
          <button onClick={LoginHandler}>Login</button> */}
    </div>
  )
}

export default Login
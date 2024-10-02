import React from 'react'
import instance from '../utils/axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import Styles from './Logout.module.css';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logOutHandler = async () => {
        try {
            let loggedOut =await instance.post('/logout');
            if (loggedOut.status < 400) {
                dispatch({ type: 'SET_LOGOUT', payload: loggedOut.data.data });
                navigate('/login');
            }
            else {
                alert('logout failed, please try again');
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }
  return (
    <div className={Styles['FeedViewBG']}>
        <Card className={Styles['loggingOut']} >
      <Card.Body style={{margin:'auto'}}>
        <Card.Title style={{textAlign:'center'}}>LOG OUT</Card.Title>
        <Card.Text>
          Are you sure you want to logout?
        </Card.Text>
        <div style={{textAlign:'center'}}>
                <Button variant="danger" onClick={()=>logOutHandler()} style={{marginRight:'7%'}}>Yes</Button>
                <Button variant="success"onClick={()=>navigate('/app')}>No</Button>
        </div>

      </Card.Body>
      </Card>
      
    </div>
  )
}

export default Logout
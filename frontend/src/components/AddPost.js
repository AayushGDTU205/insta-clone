import React, { useState } from 'react'
import instance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FloatingLabel, Form } from 'react-bootstrap';
import Navbar from './Navbar';
import Styles from './AddPost.module.css';
import btnStyle from './button.module.css';

const AddPost = () => {
    const [caption, SetCaption] = useState('');
    const [photos, SetPhotos] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const addPostHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(photos);
        formData.append('caption', caption);
        for (let i = 0; i < photos.length; i++) {
            formData.append('photos', photos[i]);
        }
        console.log(formData);
        try {
            let response = await instance.post('/holder/addPost', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            console.log(response);
            dispatch({ type: 'SET_AFTER_POST', payload: response.data });
            navigate('/profile');
        } catch (error) {
            alert(error.response.data.message);
        }
    }

  return (
      <div className={Styles['postBG']}>
          <Navbar />
          
            
              <form onSubmit={addPostHandler} className={Styles['internal-form']}>
              <h2 style={{ textAlign: 'center' }}>Share With People</h2><br />
              <div className={Styles['form-div']}>
              <FloatingLabel
                controlId="floatingInput"
                label="Caption"
                className="custom-floating-label mb-3"
            >
                <Form.Control onChange={(e)=>SetCaption(e.target.value)} style={{height:'100%'}} as='textarea'/>
            </FloatingLabel>
            {/* <input type='text' placeholder='Add your caption here' ></input><br/> */}
            <input type='file' multiple placeholder='add images'  onChange={(e) => SetPhotos(e.target.files)}></input><br/><br/>
            <button type='submit' className={btnStyle['BUTTON']}>Post!!</button>
              </div>

            </form>
          
          
          
    </div>
  )
}

export default AddPost
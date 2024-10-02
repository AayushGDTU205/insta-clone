import React, { useState } from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBCol, MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './FeedItem.module.css';
import styles from './Profile.module.css';
import btnStyle from './button.module.css';
import { Form, Link } from 'react-router-dom';
import { Button, Card, Carousel, Modal } from 'react-bootstrap';
import instance from '../utils/axios';
import image from '../icons/2180672_heart_like_notification_icon.png'
import image2 from '../icons/2246820_heart_like_notification_icon.png'
import image3 from '../icons/2180661_comment_message_notifications_icon.png'
import image4 from '../icons/1564502_basket_delete_remove_icon.png'
import NPY from '../icons/1kutzil5lj0nvfsf_1596544016_16_9.jpg'
import Navbar from './Navbar';


const Profile = () => {
  const userData = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  // dispatch({ type: 'SET_USER'});
  
  // console.log(userData);
  const username = userData.username;
  
  

  const [isHovered, setIsHovered] = useState(false);
  const [show, setShow] = useState(false);
  const [postData, setPostData] = useState();
  const [liked, setLiked] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [profile, setProfile] = useState();
  const [bio, setBio] = useState('');
  const [commSection, setCommSection] = useState(false);
  const [message, setMessage] = useState('');
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
    const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  if (!username) {
    return <div>Loading...</div>; 
  }
  const postDikha = async (postID) => {
    try {
      let postMaterial = await instance.get(`/holder/getPostItem/${postID}`);
      let indx = postMaterial.data.data.likers.findIndex(e => e.user === userData.username);
      if (indx === -1) {
        setLiked(false);
      }
      else {
        setLiked(true);
      }
      setPostData(postMaterial.data.data);
      
     } catch (error) {
      alert(error.response.data.message);
      }
  }
  // console.log(postData);
  const LikeHandler = async (postID) => {
    try { 
      let likedRes = await instance.post(`/follower/like/${postID}`, { username });
      // console.log(likedRes);
      postDikha(postID);
    } catch (error) {
      alert(error.response.data.message)
    }
  }
  const UnlikeHandler = async (postID) => {
    try { 
      let unlikedRes = await instance.post(`/follower/unlike/${postID}`, { username });
      // console.log(unlikedRes);
      postDikha(postID);
    } catch (error) {
      alert(error.response.data.message)
    }
  }
  // const [pics, setPics] = useState();
  const ChangeImage = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('profile', profile);
    try { 
      let picResponse = await instance.post('/holder/updateImage', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
      // setPics(picResponse);
      dispatch({ type: 'SET_IMAGE_CHANGE', payload: picResponse.data.data });
      alert(picResponse.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
    
  }
  
  const ChangeCaption = async (event) => {
    event.preventDefault();
    try {
      let BioResponse = await instance.post('/holder/updateBio', { bio });
      dispatch({ type: 'SET_BIO', payload: BioResponse.data.data });
      // console.log(BioResponse);
     } catch (error) {
      alert(error.response.data.message);
    }
  }
  const messageHandler = async (event,postID) => {
    event.preventDefault();
    event.target[0].value = '';
    try {
      let commentResponse = await instance.post(`/follower/comment/${postID}`, { username, message });
      console.log(commentResponse);
      postDikha(postID);
     } catch (error) {
      alert(error.response.data.message);
    }
  }
  const deleteHandler = async (postID) => {
    try {
      let deleteRes = await instance.post(`/holder/deletePost/${postID}`);
      dispatch({ type: 'SET_AFTER_POST', payload: deleteRes.data });
     } catch (error) {
      alert(error.response.data.message)
    }
  }
  return (
    <div className={styles['profileBG']}>
      <Navbar />
          <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex " style={{ width: '150px',height:'150px' }}>
                  <img src={userData.profileImage} style={{width:'150px',height:'150px',zIndex:'1'} }
                    alt="Generic" className="mt-4 mb-2 rounded-circle img-thumbnail" ></img>
                  
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                    <MDBTypography tag="h5">{ userData.username}</MDBTypography>
                  <MDBCardText>{ userData.fullname}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black d-flex justify-content-between" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <button onClick={handleShow2} className={btnStyle['BUTTON']} >Edit Image</button>
                  </div>
                  <div className="px-3">
                    <button onClick={handleShow3} className={btnStyle['BUTTON']}>Edit Bio</button>
                  </div>
                  
                </div>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">{userData.posts.length}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Posts</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">{userData.follower_count}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                   
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">{userData.following_count}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <MDBCardText className="font-italic mb-1">{userData.bio}</MDBCardText>
                    {/* <MDBCardText className="font-italic mb-1">Lives in New York</MDBCardText> */}
                    {/* <MDBCardText className="font-italic mb-0">Photographer</MDBCardText> */}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Recent Posts</MDBCardText>
                </div>
                {/* <MDBRow> */}
                  {/* <MDBCol className=""> */}
                  <div className={Styles['feedLine']} >
                  {userData.posts.length <= 0 && <div style={{margin:'auto'}}><img src={NPY} ></img></div>}
                  {userData.posts.length > 0 && userData.posts.map((item, indx) =>
                    <div key={indx} style={{ width: '150px', height: '150px' }} onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
                      <img  src={item.files[0].url} 
                        alt={item.user} style={{ width: '100%', height: '100%' }} onClick={() => { handleShow(); postDikha(item._id); }}>
                      </img>
                      
                    </div>
                    
                  )}   
                  </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      {!postData && <div>wait</div>}
      {postData && 
        <Modal show={show} onHide={handleClose} >
        
      <Card  className={Styles['PostItem'] } style={{ width: '100%'}}>
    <Carousel>
        {postData.files.map((pic, indx) => <Carousel.Item key={indx}><img style={{ width: '500px',height:'400px' }} src={ pic.url}></img></Carousel.Item>)}
    </Carousel>
            
    <Card.Body>
        <Card.Title>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span>
                  {liked === true && <span   onClick={() => UnlikeHandler(postData._id)}><img style={{width:'30px',height:'30px'} } src={image2}></img></span>}
                {liked === false && <span   onClick={()=>LikeHandler(postData._id)}><img style={{width:'30px',height:'30px'} } src={image}></img></span>}
                <span>{postData.likes}</span>
                <span><img style={{ width: '30px', height: '30px' }} src={image3}/></span>
                <span>{postData.comments}</span>
                  </span>
                  <span>
                    <img src={image4} style={{ width: '30px', height: '30px', cursor: 'pointer' }} onClick={() => { deleteHandler(postData._id); handleClose(); } } />
                  </span>
                </div> 
                
        </Card.Title>
      
      <Card.Text >
        <span style={{marginRight:'5px'}}><b>{postData.user}</b></span>
        <span>{postData.caption}</span><br/>
        {commSection===false && <div style={{marginTop:'10px',cursor:'pointer'}} onClick={()=>setCommSection(true)}>Comments</div>}
        {commSection===true && <div style={{marginTop:'10px',cursor:'pointer'}} onClick={()=>setCommSection(false)}>hide comments</div>}
        {commSection===true && <div style={{ maxHeight:'200px',overflowY:'scroll'}}>
          <form onSubmit={(e)=>messageHandler(e,postData._id)}>
                    <input type='text' placeholder='add a comment' onChange={(e) => setMessage(e.target.value)} />
                    <button type='submit'>Add</button>
          </form>
          
            {postData.commenters.map((item,indx)=><div key={indx} style={{marginTop:'5px'}}><span style={{marginRight:'5px'}}><b>{item.user}</b></span><br/><span>{item.message}</span></div>)}
          </div>}
      </Card.Text>
    </Card.Body>
          </Card>
          
        </Modal>
      }
      <Modal show={show2} onHide={handleClose2}>
      
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Image</Modal.Title>
        </Modal.Header>
        <form onSubmit={ChangeImage}>
        <Modal.Body>
          <input type='file' onChange={e=>setProfile(e.target.files[0])}/>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>Close</Button>
          <Button type='submit' variant="primary" onClick={handleClose2}>Save changes</Button>
        </Modal.Footer>
        </form>
      </Modal>
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bio</Modal.Title>
        </Modal.Header>
        <form onSubmit={ChangeCaption}>
          <Modal.Body>
          <input type='text' onChange={(e)=>{setBio(e.target.value)}} placeholder='Write New Bio'/>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>Close</Button>
          <Button type='submit' variant="primary" onClick={handleClose3}>Save changes</Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}

export default Profile
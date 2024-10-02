import React, { useEffect, useState } from 'react'
import Styles from './FeedItem.module.css'
import {  MDBCard, MDBCardBody,MDBCardText, MDBCol, MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import instance from '../utils/axios';
import btnStyle from './button.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Carousel, Modal } from 'react-bootstrap';
import image from '../icons/2180672_heart_like_notification_icon.png'
import image2 from '../icons/2246820_heart_like_notification_icon.png'
import image3 from '../icons/2180661_comment_message_notifications_icon.png'
import NPY from '../icons/1kutzil5lj0nvfsf_1596544016_16_9.jpg'

const OtherProfile = () => {
  const { username } = useParams();
  const currUser = useSelector(state => state.userReducer);
  const [isFollowing, SetisFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [commSection, setCommSection] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  console.log(username);
  useEffect(() => {
    let gettingUser = async () => {
      try {
        const { data } = await instance.get(`/follower/getProfile?username=${username}`);
        console.log(data.data);
        setUserData(data.data);
        let indx = data.data.followers.findIndex(e => e.user_name === currUser.username);
        console.log(indx);
        if (indx !== -1) {
          SetisFollowing(true);
        }
        else {
          SetisFollowing(false);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    }
    gettingUser();
  }, [username, isFollowing]);
  const UnfollowHandler = async () => {
    try { 
      let  unfollow   = await instance.post('/follower/unfollow', { username });
      console.log(unfollow.data);
      dispatch({ type: 'SET_AFTER_UNFOLLOW', payload: unfollow.data.data[1] });
    } catch (error) {
      alert(error);
    }
  }
  const FollowHandler = async () => {
    try {
      let follow = await instance.post('/follower/follow', { username });
      console.log(follow.data);
      dispatch({type:'SET_AFTER_UNFOLLOW',payload:follow.data.data[1]})
     } catch (error) {
      
    }
  }
  const [show, setShow] = useState(false);
  const [postData, setPostData] = useState();
  const [liked, setLiked] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  const postDikha = async (postID) => {
    try {
      let postMaterial = await instance.get(`/follower/getPostItem/${postID}?username=${username}`);
      console.log(postMaterial);
      let indx = postMaterial.data.data.likers.findIndex(e => e.user === currUser.username);
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
  console.log(postData);
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
  // const findFollower = () => {
    
  // }
  // findFollower();
  // console.log(userData);
  return (
    <div className={Styles['ProfilePage']}>
      {!userData && <div>please wait</div>}
      {userData && <div>
        <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex " style={{ width: '150px',height:'150px' }}>
                    <img style={{width:'150px',height:'150px',zIndex:'1'} } src={userData.profileImage}
                      alt="Generic" className="mt-4 mb-2 img-thumbnail rounded-circle" ></img>
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                    <MDBTypography tag="h5">{ userData.username}</MDBTypography>
                  <MDBCardText>{ userData.fullname}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black d-flex justify-content-between" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-inline-flex justify-content-start text-center py-1">
                  <div>
                      {isFollowing === true && <button
                        onClick={() => {
                          UnfollowHandler();
                          SetisFollowing(false);
                        }}
                        className={btnStyle['BUTTON']}
                      >following</button>}
                      {isFollowing === false && <button
                        onClick={() => {
                          FollowHandler();
                          SetisFollowing(true);
                        }}
                        className={btnStyle['BUTTON']}
                      >follow</button>}
                  </div>
                </div>
                <div className="d-inline-flex justify-content-end text-center py-1">
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
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Recent posts</MDBCardText>
                </div>
                  <div className={Styles['feedLine']} >
                    {userData.posts.length<=0 && <div style={{margin:'auto'}}><img src={NPY} ></img></div>}
                    {userData.posts.length > 0 && userData.posts.map((item, indx) => <img key={indx} src={item.files[0].url}
                      alt={item.user} style={{width:'150px' ,height:'150px'}} onClick={() => { handleShow(); postDikha(item._id); }}></img>)}   
                  </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>}
      {/* {!postData && <div>wait</div>} */}
      {postData && 
      <Modal show={show} onHide={handleClose}>
        
      <Card className={Styles['PostItem'] } style={{ width: '100%'}}>
    <Carousel>
        {postData.files.map((pic, indx) => <Carousel.Item key={indx}><img style={{ width: '500px',height:'400px' }} src={ pic.url}></img></Carousel.Item>)}
  </Carousel>
    <Card.Body>
        <Card.Title> 
                {liked === true && <span   onClick={() => UnlikeHandler(postData._id)}><img style={{width:'30px',height:'30px'} } src={image2}></img></span>}
                {liked === false && <span   onClick={()=>LikeHandler(postData._id)}><img style={{width:'30px',height:'30px'} } src={image}></img></span>}
                <span>{postData.likes}</span>
                <span><img style={{ width: '30px', height: '30px' }} src={image3}/></span>
                <span>{postData.comments}</span>
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
    </div>
  )
}

export default OtherProfile
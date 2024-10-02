import React, { useEffect, useState } from 'react'
import { Card, Carousel } from 'react-bootstrap';
import Styles from './FeedItem.module.css';
import { NavLink } from 'react-router-dom';
import instance from '../utils/axios';
import { useSelector } from 'react-redux';
import image from '../icons/2180672_heart_like_notification_icon.png'
import image2 from '../icons/2246820_heart_like_notification_icon.png'
import image3 from '../icons/2180661_comment_message_notifications_icon.png'
import btnStyle from './button.module.css';

const FeedItem = (props) => {
  console.log(props.post._id);
  const username = props.post.user;
  const currUser = useSelector(state => state.userReducer);
  const [postData, setPostData] = useState();
  const [liked, setLiked] = useState(false);
  const [commSection, setCommSection] = useState(false);
  const [message, setMessage] = useState('');
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
  useEffect(() => {
    if (props.post._id) {
      postDikha(props.post._id);
    }
  }, [props.post._id]);
  // postDikha(props.post._id);
  console.log(liked);
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
  return (
    <div>
      {!postData && <div>wait</div>}
      {postData && 
        <Card className={Styles['PostItem'] } style={{ width: '500px', height:'100vh' }}>
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
        
        <Card.Text style={{height:'75%'}}>
          <span style={{marginRight:'5px'}}><b>{postData.user}</b></span>
          <span>{postData.caption}</span><br/>
          {commSection===false && <div style={{marginTop:'10px',cursor:'pointer'}} onClick={()=>setCommSection(true)}>Comments</div>}
          {commSection===true && <div style={{marginTop:'10px',cursor:'pointer'}} onClick={()=>setCommSection(false)}>hide comments</div>}
          {commSection===true && <div style={{ maxHeight:'60%',overflowY:'scroll'}}>
            <form onSubmit={(e)=>messageHandler(e,postData._id)}>
                      <input type='text' style={{border:'none',borderBottom:'1px black solid'}} placeholder='add a comment' onChange={(e) => setMessage(e.target.value)} />
                      <button type='submit' className={btnStyle['BUTTON']} style={{marginLeft:'8px'}}>Add</button>
            </form>
            
              {postData.commenters.map((item,indx)=><div key={indx} style={{marginTop:'5px'}}><span style={{marginRight:'5px'}}><b>{item.user}</b></span><br/><span>{item.message}</span></div>)}
            </div>}
        </Card.Text>
      </Card.Body>
        </Card>
      }
      
      
          {/* {props.item[0].caption} */}
    </div>
  )
}

export default FeedItem
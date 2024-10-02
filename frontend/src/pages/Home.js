import React, { useEffect, useState } from 'react'
import instance from '../utils/axios';
import Styles from './Home.module.css'
import FeedItem from '../components/FeedItem';
import Navbar from '../components/Navbar';
import image5 from '../icons/download.jpeg';
const Home = () => {
    const [myFeed, setMyFeed] = useState([]);
    // const dispatch = useDispatch();
    useEffect(() => {
        const feed = async () => {
            try {
                const Feed = await instance.get('/follower/feed');
                // console.log(Feed.data.data);
                setMyFeed(Feed.data.data);
                // dispatch({ type: 'SET_FEED', payload: Feed.data.data });
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        feed();
    }, []);
    console.log(myFeed);
    return (
        <div className={Styles['FeedViewBG']}>
            <Navbar />
            
            <div className={Styles['FeedViewBar']}>
          
          {myFeed.length<=0 && <div style={{marginTop:'5vh',textAlign:'center'}}><h3>Connect with people</h3><br/><img style={{width:'50vi',height:'60vh'}} src={image5}></img></div>}
          {myFeed.length>0 && myFeed.map((item, indx) => <FeedItem  key={indx} post={ item} />)}
            </div>
      </div>
      
  )
}

export default Home
import React, { useEffect, useState } from 'react'
import Styles from './FeedItem.module.css'
import instance from '../utils/axios'
import { Link, Outlet} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';


const SearchBar = () => {
    const [text, SetText] = useState('');
    const [people, Setpeople] = useState([]);
    const userData = useSelector(state => state.userReducer);
    useEffect(() => {
        const SearchHandler = setTimeout(async () => {
            try {
                const choices = await instance.get(`/follower/getUsers?text=${text}`);
                console.log(choices.data.data);
                let notMe = choices.data.data.filter((e) => e !== userData.username);
                // console.log(notMe);
                Setpeople(notMe);
            } catch (error) {
                alert(error.response.data.message);
            }
        }, 1000);
        return () => clearTimeout(SearchHandler);
    }, [text]);
    
    return (
        <div className={Styles['searchBG']}>
            <Navbar />
            <div style={{display:'flex'}} className={Styles['internal']}>
            <div className={Styles['SearchBar']}>
            
            <input type='text' style={{width:'100%'}} className={Styles['inputbar']} onChange={e => SetText(e.target.value)}></input>
            {!people.length && <div>Users Not Found</div> }
            {people.length > 0 && people.map((name, indx) => <Link key={indx} to={name} style={{textDecoration:'none'}} ><button className={Styles['search-button']}>{name }</button></Link>)}  
              </div>
              <Outlet/>
            </div>
            
        </div>
      
  )
}

export default SearchBar
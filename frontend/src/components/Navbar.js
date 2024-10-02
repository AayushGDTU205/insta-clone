import React, { useState } from 'react';
import Styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfPic from './ProfPic';

const Navbar = () => {
  const userData = useSelector(state => state.userReducer)
  
  
  return (
    <div className={Styles['Bar']}>
          

          {userData.isLoggedIn && <NavLink className={({isActive}) =>(isActive? Styles['link']: Styles['link2'])} to="/app">Home</NavLink>}
          {userData.isLoggedIn && <NavLink className={({isActive}) =>(isActive? Styles['link']: Styles['link2'])} to="/search">Search</NavLink>}
          {userData.isLoggedIn && <NavLink className={({isActive}) =>(isActive? Styles['link']: Styles['link2'])} to="/profile">Profile</NavLink>}
          {userData.isLoggedIn && <NavLink className={({isActive}) =>(isActive? Styles['link']: Styles['link2'])} to="/addPost">Post</NavLink>}
          {userData.isLoggedIn && <NavLink className={({isActive}) =>(isActive? Styles['link']: Styles['link2'])} to="/logout">Logout</NavLink> }
    </div>
  )
}

export default Navbar
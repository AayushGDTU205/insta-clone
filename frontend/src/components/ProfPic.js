import React from 'react'
import { useSelector } from 'react-redux'
import Styles from './ProfPic.module.css'


const ProfPic = () => {
    const userData = useSelector(state => state.userReducer);
    const photo = userData.profileImage;
  return (
      <div>
          <img  className={Styles['profilePhoto']} src={photo}></img>
    </div>
  )
}

export default ProfPic
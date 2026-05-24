import React, { useState } from 'react'
import "./ProfileUpdate.css"
import assets from '../../assets/assets'
const ProfileUpdate = () => {
  const [image,setImage]=useState(false);
  return (
    <div className='profile'>
      <div className='profile-container'>
        <form>
          <h3> Profile details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type='file' id="avatar" accept='.jjpg,.png,.jpeg' hidden/>
            <img src={image?URL.createObjectURL(image):assets.avatar_icon}/>
            upload profile image
          </label>
          <input type="text" placeholder='Your name' required/>
          <textarea placeholder='Write profile bio' required></textarea>
          <button type="submit">Save</button>
        </form>
        <img className="profile-pic" src={image?URL.createObjectURL(image):assets.logo_icon} /> 
      </div>
    </div>
  )
}

export default ProfileUpdate

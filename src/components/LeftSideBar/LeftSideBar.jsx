import React from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
const LeftSideBar = () => {
  return (
    <div className='ls'>
        <div className="ls-top">
            <div className='ls-nav'>
                <img src={assets.logo} alt="" className='logo' />
                <div className='menu'>
                    <img src={assets.menu_icon} alt="" className='menu-icon' />
                </div>
            </div>
            <div className='ls-search'>
                <img src={assets.search_icon} alt="" className='search-icon' />
                <input type="text" placeholder='Search or start new chat' className='search-input' />
            </div>
        </div>
      <div className="ls-list">
       {Array(12).fill("").map((item, index) => (
         <div className="friends" key={index}>
           <img src={assets.profile_img} alt="" className='profile-img' />
           <div>
             <p>John Doe</p>
             <span>Hello there!</span>
           </div>
         </div>
       ))}
      </div>
    </div>
  )
}

export default LeftSideBar

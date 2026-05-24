import React from 'react'
import assets from '../../assets/assets'

import './RightSideBar.css'
const RightSideBar = () => {
  return (
    <div className='rs'>
      <div className='rs-profile'>
        <img src={assets.profile_img} alt=""/>
        <h3>Rischard <img src={assets.green_dot} className='dot'/></h3>
        <p>Hey, there i am Richard Sanford using chat app</p>
       </div> 
       <hr />
       <div className="rs-media">
        <p>Media</p>
        <div>
        <img src={assets.pic1}/>
          <img src={assets.pic2}/>
          <img src={assets.pic3}/>
          <img src={assets.pic4}/>
          <img src={assets.pic1}/>
          <img src={assets.pic2}/>
        </div>      
       </div>
       <button>logout</button>
    </div>
  )
}

export default RightSideBar

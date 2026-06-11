import React, { useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { db } from "../../config/firebase"
import { collection, getDocs, doc, query, serverTimestamp, setDoc, updateDoc, where, arrayUnion } from 'firebase/firestore'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);


  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          })
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }

        } else {
          setShowSearch(null);
        }
      } else {
        setShowSearch(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });




    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  }

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className='ls-nav'>
          <img src={assets.logo} alt="" className='logo' />
          <div className='menu'>
            <img src={assets.menu_icon} alt="" className='menu-icon' />
            <div className='sub-menu'>
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className='ls-search'>
          <img src={assets.search_icon} alt="" className='search-icon' />
          <input onChange={inputHandler} type="text" placeholder='Search or start new chat' className='search-input' />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user
          ? <div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} />
            <p>{user.username}</p>
          </div>
          :
          Array(12).fill("").map((item, index) => (
            <div className="friends" key={index}>
              <img src={assets.profile_img} alt="" className='profile-img' />
              <div>
                <p>John Doe</p>
                <span>Hello there!</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default LeftSideBar

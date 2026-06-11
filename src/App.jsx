import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './context/AppContext.jsx'


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loadUserData, userData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate, loadUserData]);

  useEffect(() => {
    if (userData) {
      if (userData.avatar && userData.name) {
        if (location.pathname === '/') {
          navigate('/chat');
        }
      } else {
        navigate('/profile');
      }
    }
  }, [userData, location.pathname, navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<ProfileUpdate />} />

      </Routes>
    </>
  )
}

export default App


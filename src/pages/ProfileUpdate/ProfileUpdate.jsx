import React, { useState, useEffect, useContext } from 'react'
import "./ProfileUpdate.css"
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'
import { AppContext } from '../../context/AppContext'

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData, loadUserData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setBio(userData.bio || "");
      setPrevImage(userData.avatar || "");
    }
  }, [userData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Please upload a profile image");
        return;
      }

      const currentUid = uid || (auth.currentUser ? auth.currentUser.uid : null);
      if (!currentUid) {
        toast.error("User not authenticated");
        return;
      }

      setLoading(true);
      const userRef = doc(db, 'users', currentUid);

      let imgUrl = prevImage;
      if (image) {
        imgUrl = await upload(image);
        setPrevImage(imgUrl);
      }

      await updateDoc(userRef, {
        avatar: imgUrl || "",
        name: name,
        bio: bio
      });

      await loadUserData(currentUid);
      toast.success("Profile updated successfully!");
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='profile'>
      <div className='profile-container'>
        <form onSubmit={handleProfileUpdate}>
          <h3> Profile details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type='file' id="avatar" accept='.jpg,.png,.jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : (prevImage ? prevImage : assets.avatar_icon)} alt="avatar" />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder='Your name'
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : (prevImage ? prevImage : assets.logo_icon)}
          alt="profile preview"
        />
      </div>
    </div>
  )
}

export default ProfileUpdate


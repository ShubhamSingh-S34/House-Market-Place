import React, { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { toastifyError, toastifySuccess } from '../toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
  const auth=getAuth();
  const [changeDetails, setChangeDetails] =useState(false);
  const [formData,setFormData]= useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  });

  const {name,email}=formData;

  const navigate=useNavigate()
  const logout=()=>{
    auth.signOut();
    navigate('/');
  }

  const changeDetailsHandler=()=>{
    if(changeDetails){
      onSubmitHandler();
    }
    setChangeDetails((prevState)=>(!prevState))
  }
  const onSubmitHandler= async()=>{
    try {
      if(auth.currentUser.displayName!=name){
        // update display name in authentication
        updateProfile(auth.currentUser,{
          displayName:name
        })

        // update in firestore
        const userRef= doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef,{
          name:name
        })

      }
    } catch (error) {
      console.log(error);
      toastifyError("Could not update profile details")
    }
  }


  const onChange=(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
  }

  return <div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button className='logOut' type='button' onClick={logout}>Logout</button>
    </header>

    <main>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'> Personal Details </p>
        <p className='changePersonalDetails' onClick={changeDetailsHandler} >
          {changeDetails?'Done':'Edit'}
        </p>
      </div>
      <div className='profileCard'>
        <form>
          <input type='text' id='name' 
            className={!changeDetails?'profileName':'profileNameActive'} 
            disabled={!changeDetails}
            value={name}
            onChange={onChange} 
          />
          <input type='text' id='email' 
            className={!changeDetails?'profileName':'profileNameActive'} 
            disabled={!changeDetails}
            value={email}
            onChange={onChange} 
          />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home'/>
        <p>Sell or Rent your home</p>
        <img src={arrowRight} alt='arrow right' />
      </Link>
    </main>

  </div>
}

export default Profile
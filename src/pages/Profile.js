import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import SignIn from './SignIn';
import { Link } from 'react-router-dom';


function Profile() {
  const [user,setUser]= useState(null);
  const auth=getAuth();
  useEffect(()=>{
    console.log("Inside profile page!!!");
    console.log(auth.currentUser);
    setUser(auth.currentUser);
  },[user])

  return user? <h1>{user.displayName}</h1>:
  <div>
    <h1>Not Logged In</h1>
    <Link to='/sign-in'>Sign in here</Link>
  </div>
}

export default Profile
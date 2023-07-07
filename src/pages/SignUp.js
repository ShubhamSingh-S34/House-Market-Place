// import React from 'react'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {db} from '../firebase.config'
import { getDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { toastifyError, toastifySuccess } from '../toastify'
import OAuth from '../components/OAuth'



function SignUp() {
  
  const [showPassword,setShowPassword] =useState(false);
  const [formData, setFormData]=useState({
    name:"",
    email:"",
    password:"",
  });

  const {name, email,password}= formData;
  const navigate= useNavigate();


  const onChangeHamdler=function(e){
    setFormData((prevState)=>({
      ... prevState,
      [e.target.id]:e.target.value,
    }))
  }



  const onSubmitHandler=async(e)=>{
    e.preventDefault();
    try{
      const auth=getAuth();
      const userCred=await createUserWithEmailAndPassword(auth,email,password)
      const user=userCred.user;

      // console.log(user);
      const formDataCopy={...formData};
      // delete formDataCopy.password;
      await setDoc(doc(db,'users',user.uid),formDataCopy)
      .then(console.log("User added to the user database!!!"))
      .catch((err)=>{console.log('ERROR IN CREATING USER...', err)}); 

      await updateProfile(auth.currentUser,{
        displayName:name,
      })
      toastifySuccess('New User Created.')
      navigate('/profile'); 
    }
    catch(e){
      toastifyError("Problem creating new user!")
      console.log(e);
    }
  }
  return (
    <>
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>
          Welcome Back!!!
        </p>
      </header>
      <form onSubmit={onSubmitHandler}>
      <input 
          type='text' 
          className='nameInput' 
          placeholder='Name' 
          id='name'
          value={name}
          onChange={onChangeHamdler}
         />
        <input 
          type='email' 
          className='emailInput' 
          placeholder='Email' 
          id='email'
          value={email}
          onChange={onChangeHamdler}
         />
        <div className='passwordInputDiv'>
          <input 
            type={showPassword?'text':'password'}
            className='passwordInput'
            placeholder='Password'
            id='password'
            value={password}
            onChange={onChangeHamdler}
          />
          <img src={visibilityIcon} alt='show password' className='showPassword'
            onClick={()=>{setShowPassword((prevState)=>!prevState)}} />
        </div>

        <Link to='/forgetpassword' className='forgotPasswordLink'>Forget Password</Link>
        <div className='signUpBar'>
          <p className='signUpText'>
            Sign up
          </p>
          <button className='signInButton'>
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
          </button>
        </div>
      </form>

      {/* google oAUTH vomponenet */}
      <OAuth />
      <Link to='/sign-in' className='registerLink'>
        Sign In Instead
      </Link>

    </div>
    </>
  )
}

export default SignUp
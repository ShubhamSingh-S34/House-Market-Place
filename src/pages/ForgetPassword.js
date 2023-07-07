import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { Link } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../toastify';
import { async } from '@firebase/util';

function ForgetPassword() {
  const [email,setEmail] =useState('');
  const onChange=(e)=>{
    setEmail(e.target.value);
  }
  const onSubmit=async(e)=>{
    e.preventDefault();  
    try{
      const auth=getAuth();
      console.log(email);
      await sendPasswordResetEmail(auth,email)
      toastifySuccess('Email was sent')
    }
    catch(err){
      toastifyError('oops Error occured!!!');
      console.log(err);
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'> Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input 
          className='emailInput' 
          type='text' id='email' 
          placeholder='Email' 
          value={email} 
          onChange={onChange} 
        />
        <Link className='forgotPasswordLink' to='/sign-in'>
          Sign In
        </Link>
        <div className='signInBar'>
          <div className='signInText'>
            Send Reset Link
          </div>
          <button className='signInButton'>
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
          </button>
        </div>
        </form>
      </main>
    </div>
  )
}

export default ForgetPassword
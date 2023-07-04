import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {

  const [showPassword,setShowPassword] =useState(false);
  const [formData, setFormData]=useState({
    email:"",
    password:"",
  });

  const {email,password}= formData;
  const navigate= useNavigate();
  const onChangeHamdler=function(e){
    setFormData((prevState)=>({
      ... prevState,
      [e.target.id]:e.target.value,
    }))
  }

  return (
    <>
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>
          Welcome Back!!!
        </p>
      </header>
      <form>
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
        <div className='signInBar'>
          <p className='signInText'>
            Sign In
          </p>
          <button className='signInButton'>
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
          </button>
        </div>
      </form>

      {/* google oAUTH vomponenet */}
      <Link to='/sign-up' className='registerLink'>
        Sign Up Instead
      </Link>

    </div>
    </>
  )
}

export default SignIn
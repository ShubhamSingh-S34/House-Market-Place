import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toastifyError } from '../toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
// import { async } from '@firebase/util'


function OAuth() {


    const navigate= useNavigate()
    const location= useLocation();
    const onGoogleClick= async()=>{
        try {
            const auth=getAuth();
            const provider=new GoogleAuthProvider();
            const result= await signInWithPopup(auth,provider);
            const user=result.user;

            const docRef= doc(db,'users', user.uid);
            const docSnap=await getDoc(docRef);
            if(!docSnap.exists()){
                // Creating user in database ... first time sign in
                setDoc(docRef,{
                    name:user.displayName,
                    email:user.email,
                    timestamp: serverTimestamp(), 
                })
            }
            navigate('/');

        } catch (error) {
            toastifyError('OOPS')
            console.log(error);
        }
    }
  return (
    <div className='socialLogin'>
        <p>
            Sing {location.pathname==='/sign-up'? 'up':'in'} with 
        </p>
        <button className='socialIconDiv' onClick={onGoogleClick}>
            <img className='socialIconImg' src={googleIcon} alt='google' />
        </button>
    </div>
  )
}

export default OAuth
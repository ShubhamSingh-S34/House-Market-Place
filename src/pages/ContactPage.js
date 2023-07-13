import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toastifyError } from '../toastify'
import { async } from '@firebase/util'



function ContactPage() {
    const [message, setMessage] =useState("");
    const [landlord, setLandlord] =useState("");
    const [searchParams, setSearchParams] = useSearchParams()
    const params=useParams();
    useEffect(()=>{
        const getLandlord=async()=>{
            const docRef=doc(db, 'users', params.landlordID);
            console.log(params.landlordID)
            const snap=await getDoc(docRef);
            if(snap.exists()){
                setLandlord(snap.data());
            }
            else{
                toastifyError("This landlord dosent exist!!!");
            }
        }
        getLandlord();
    },[params.landlordID])
    const onChange = (e) => setMessage(e.target.value)
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default ContactPage
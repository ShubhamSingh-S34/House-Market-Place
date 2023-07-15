import React, { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc, collection, getDocs, where, orderBy, deleteDoc, query } from 'firebase/firestore';
import { toastifyError, toastifySuccess } from '../toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';


function Profile() {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate()
  const logout = () => {
    auth.signOut();
    navigate('/');
  }

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, where("userRef", '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return (listings.push({
          id: doc.id,
          data: doc.data(),
        }))
      })
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [])

  const changeDetailsHandler = () => {
    if (changeDetails) {
      onSubmitHandler();
    }
    setChangeDetails((prevState) => (!prevState))
  }
  const onSubmitHandler = async () => {
    try {
      if (auth.currentUser.displayName != name) {
        // update display name in authentication
        updateProfile(auth.currentUser, {
          displayName: name
        })

        // update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name
        })

      }
    } catch (error) {
      console.log(error);
      toastifyError("Could not update profile details")
    }
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toastifySuccess('Listing Deleted !')
    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }


  if (loading) { return <Spinner /> }

  return <div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button className='logOut' type='button' onClick={logout}>Logout</button>
    </header>

    <main>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'> Personal Details </p>
        <p className='changePersonalDetails' onClick={changeDetailsHandler} >
          {changeDetails ? 'Done' : 'Edit'}
        </p>
      </div>
      <div className='profileCard'>
        <form>
          <input type='text' id='name'
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <input type='text' id='email'
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home' />
        <p>Sell or Rent your home</p>
        <img src={arrowRight} alt='arrow right' />
      </Link>


      {!loading && listings?.length > 0 && (
        <>
          <p className='listingsText'>Your Listings</p>
          <ul>
            {listings.map(({ id, data }) => {
              return <ListingItem key={id} listing={data} id={id} onDelete={() => onDelete(id)} />
            })}
          </ul>
        </>
      )}


    </main>

  </div>
}

export default Profile
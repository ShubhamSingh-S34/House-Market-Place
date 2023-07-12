import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toastifyError, toastifySuccess } from '../toastify';




function CreateListings() {
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading,setLoading] =useState(false);
    const [formData,setFormData]=useState({
        type:'rent',
        name:'',
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished:false,
        address:'',
        offer:false,
        regularPrice:0,
        discountedPrice:0,
        images:{},
        latitude:0,
        longitude:0,

    })
    var {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude,longitude}= formData
    const auth=getAuth();
    const navigate=useNavigate();
    const isMounted=useRef(true);

    useEffect(()=>{
        if(isMounted){
            onAuthStateChanged(auth,(user)=>{
                if(user){
                    setFormData({...formData, userRef:user.uid});
                }
                else{
                    navigate('/sign-in');
                }
            })
        }
        return  ()=>{
            isMounted.current=false;
        }
    },[])
    if(loading){
        return <Spinner />
    }

    const getLatLnGData=async (address)=>{
      var requestOptions = {
        method: 'GET',
      };
      let data=[];
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=f61e798859ea470e86592fab9b295923`, requestOptions)
        .then(response => response.json())
        .then(result => {
          
          if((result.features[0].geometry.coordinates)){
            // console.log(result.features[0].geometry.coordinates);
            data.push(result.features[0].geometry.coordinates[0]);
            data.push(result.features[0].geometry.coordinates[1]);
          }
        })
        .catch((err)=>{
          toastifyError("Please enter a valid address");
          console.log(err);
        });
      console.log("This is from data ",data);
      return data;
      // return [10,20];
    }


    const onSubmit=async(e)=>{
        e.preventDefault();
        // console.log(formData);
        setLoading(true);
        let location;
        let geoLocation={}
        if(discountedPrice>regularPrice){
            setLoading(false);
            toastifyError("Discounted Price needs to be less than Regular price!");
        }
        if(images.length>6){
            setLoading(false);
            toastifyError("Cant Upload more than 6 images!");
        }
        const geoData= await getLatLnGData(address);
        geoLocation.lat=geoData[0];
        geoLocation.lng=geoData[1];
        console.log("This is from geolocation",geoLocation);
        location=address;


        // store images in firebase
        const storeImage = async (image) => {
          return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
    
            const storageRef = ref(storage, 'images/' + fileName)
    
            const uploadTask = uploadBytesResumable(storageRef, image)
    
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused')
                    break
                  case 'running':
                    console.log('Upload is running')
                    break
                  default:
                    break
                }
              },
              (error) => {
                reject(error)
              },
              () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL)
                })
              }
            )
          })
        }


        const imageUrls=await Promise.all(
            [...images].map((image)=>storeImage(image))
        ).catch(()=>{
            setLoading(false);
            toastifyError("Images not uploaded");
            return;
        })  
        console.log(imageUrls);

        const formDataCopy={...formData,
          imageUrls,
          geoLocation,
          location,
          timestamp:serverTimestamp(),  
        }
        delete formDataCopy.images;
        delete formDataCopy.address;
        !formDataCopy.offer && delete formDataCopy.discountedPrice; 
        const docRef= await addDoc(collection(db,'listings'), formDataCopy);
        setLoading(false);
        toastifySuccess("Listing saved");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);

    }


    const onMutate=(e)=>{
        let boolean = null

        if (e.target.value === 'true') {
        boolean = true
        }
        if (e.target.value === 'false') {
        boolean = false
        }

        // Files
        if (e.target.files) {
        setFormData((prevState) => ({
            ...prevState,
            images: e.target.files,
        }))
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value,
        }))
        }
    }
    

  return (
    <div className='profile'>
        <header>
            <p className='pageHeader'>Create a listing</p>
        </header>
        <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button type='button'className={type === 'sell' ? 'formButtonActive' : 'formButton'}
              id='type' value='sell' onClick={onMutate}>
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
        </main>
    </div>
  )
}

export default CreateListings
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { layerGroup } from 'leaflet'
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// import SwiperCore from 'swiper'
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

// Import Swiper styles
import 'swiper/css';

function Listing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const [images, setImages]=useState({});
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()
  
    useEffect(() => {
      const fetchListing = async () => {
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc(docRef)
  
        if (docSnap.exists()) {
          setListing(docSnap.data());
          console.log(listing);
          setLoading(false)
        }
      }
      fetchListing()
    }, [navigate, params.listingId])

    if(loading){
      return <Spinner />
    }

  return (
    
    <main>
      
      
      {/* SLIDE SHOW */}
      {/* {console.log(listing.imageUrls)} */}
      <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      >
        {listing.imageUrls.map((imgurl,index)=>{
          return (
            <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${imgurl}) center no-repeat`,
                backgroundSize: 'cover',
                width:'100%',
                height:'550px'
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
          )
        })}
      </Swiper>







      <div className='shareIconDiv' onClick={()=>{
        // FUNCTION TO COPY LINK TO CLIPBOARD
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true);
        setTimeout(()=>{
          setShareLinkCopied(false);
        },2000)  
      }}>
        <img src={shareIcon}  />
      </div>
      {shareLinkCopied && (<p className='linkCopied'>Link Copied</p>)}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name}- {listing.offer? listing.offerPrice:listing.regularPrice}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>{listing.type==='rent'? "rent":"sale"}</p>
        {listing.offer && (
          <p className='discountPrice'>
            {listing.regularPrice-listing.discountedPrice} discountedPrice
            </p>
        )}


          <ul className='listingDetailsList'>
            <li>
              {listing.bedrooms>1?`${listing.bedrooms} Bedrroms`: '1 Bedroom'}
            </li>
            <li>
              {listing.bathrooms>1?`${listing.bathrooms} Bathrooms`: '1 bathrooms'}
            </li>
            <li>
              {listing.parking && 'Parking Spot'}
            </li>
            <li>
              {listing.furnished && 'Furnished '}
            </li>
          </ul>

          <p className='listingLocationTitle'>Location</p>
          {/* MAP */}
          <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geoLocation.lat, listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.geoLocation.lat, listing.geoLocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
          {auth.currentUser?.uid!==listing.userRef &&(
            <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
              Contact Landlord
            </Link>
          )}
      </div>
    </main>
  )
}

export default Listing
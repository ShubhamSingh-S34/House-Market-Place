import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, doc, docs, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import Spinner from './Spinner';
import { useEffect } from 'react';



function Slider() {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, 'listings');
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q);
            let listingsTemp = [];
            querySnap.forEach((doc) => {
                listingsTemp.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listingsTemp);
            console.log("Listings :", listings);
            setLoading(false);
        }
        fetchListings();
    }, [])
    if (loading) return <Spinner />
    if (listings) {
        return <>
            {console.log("Slider", listings)}
            <p className='exploreHeading'>Recommended listings</p>
            {console.log(listings.data)}
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
            >
                {listings.map(({ data, id }) => {
                    return (
                        <SwiperSlide key={id} onClick={() => { navigate(`/category/${data.type}/${id}`) }}>
                            <div
                                className='swiperSlideDiv'
                                style={{ background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', width: '100%', height: '500px' }}
                            >
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </>
    }
    return (
        <div>Slider</div>
    )
}

export default Slider
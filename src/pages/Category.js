
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where,orderBy, limit, startAfter, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toastifyError, toastifySuccess } from '../toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'



function Category() {
    const [listings, setListings]= useState([]);
    const [loading, setLoading]= useState(true);
    const params=useParams();
    useEffect(()=>{
        const fetchListings=async()=>{
            try{
                // listing reference
                const listingsRef=collection(db,'listings');
                // generating query
                const q= await query(listingsRef, where('type','==', params.categoryName), 
                orderBy('timestamp','desc'), 
                limit(10))

                // execute query
                const querySnap=await getDocs(q);
                // console.log(querySnap);
                let listingsTemp=[];
                querySnap.forEach((doc)=>{
                    // console.log(doc.data());
                    return listingsTemp.push({
                        id:doc.id,
                        data:doc.data(),
                    })
                })
                setListings(listingsTemp);
                setLoading(false);
                console.log(listings)
            }   
            catch(err){
                toastifyError("OOPS!!!");
                console.log(err);
            }
        }
        fetchListings();
    },[])

  return (
    <div className='category'>
        <header className=''>
            <p className='pageHeader'>
                Places for {params.categoryName}
            </p>
            {loading ? 
            <Spinner />: 
            listings && listings.length>0 ? 
            
           ( <>
            {console.log("Inside main",listings)}
                <main>
                    <ul className='categoryListings'>
                        {listings.map((listing)=>(
                            <ListingItem  listing={listing.data} id={listing.id} />
                        ))}
                    </ul>
                </main>
            </>):
            <p>No listsings for {params.categoryName}</p>}
        </header>
    </div>
  )
}

export default Category
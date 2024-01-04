
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toastifyError, toastifySuccess } from '../toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'



function Category() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);
    const params = useParams();
    useEffect(() => {
        const fetchListings = async () => {
            try {
                console.log('Inside fetchListings in Category.js');
                // listing reference
                const listingsRef = collection(db, 'listings');
                // generating query

                const q = await query(listingsRef, where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10))

                // execute query
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)
                // console.log(querySnap);
                let listingsTemp = [];
                querySnap.forEach((doc) => {
                    // console.log(doc.data());
                    return listingsTemp.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })
                setListings(listingsTemp);
                setLoading(false);
                console.log(listings)
            }
            catch (err) {
                toastifyError('Oops!');
                console.log('Inside fetchListings catch block ', err);
            }
        }
        fetchListings();
    }, [])


    // Load more
    const onFetchMoreListings = async () => {
        try {
            // listing reference
            const listingsRef = collection(db, 'listings');
            // generating query

            const q = await query(listingsRef, where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'), startAfter(lastFetchedListing),
                limit(10))

            // execute query
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)
            // console.log(querySnap);
            let listingsTemp = [];
            querySnap.forEach((doc) => {
                // console.log(doc.data());
                return listingsTemp.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings((prevState) => { return [...prevState, ...listingsTemp] });
            setLoading(false);
            console.log(listings)
        }
        catch (err) {
            toastifyError("OOPS!!!");
            console.log(err);
        }
    }




    return (
        <div className='category'>
            <header className=''>
                <p className='pageHeader'>
                    Places for {params.categoryName}
                </p>
                {
                    loading ?
                        <Spinner /> :
                        listings && listings.length > 0 ?

                            (<>
                                {console.log("Inside main", listings[0].data)}
                                <main>
                                    <ul className='categoryListings'>
                                        {listings.map((listing) => (
                                            <ListingItem listing={listing.data} id={listing.id} />
                                        ))}
                                    </ul>
                                </main>
                                {lastFetchedListing && (<p className='loadMore' onClick={onFetchMoreListings}> Load More </p>)}
                            </>) :
                            <p>No listsings for {params.categoryName}</p>
                }
            </header>
        </div>
    )
}

export default Category
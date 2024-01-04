import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'


// during initial loading auth.currentuser is null (from Profile.js) because it takes time for get auth to set the current user.
// after setUser is set, onAuthStateChanged function gets fired and loggedin state is changed. 
// which inturn changes the private route state which is exported from this hook towards PrivateRoute.js


export const useAuthStatus = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
            setLoading(false);
        })
    })
    return { loggedIn, loading };
}

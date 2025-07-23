import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { auth } from './config';


export const AuthContext = createContext();

export default function AuthProvider({children}) {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , (user)=>{
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    } , []);

    

  return (
    <>
    <AuthContext.Provider value={{user:user , loading:loading}} >
        {children}
    </AuthContext.Provider>
    </>
  )
}

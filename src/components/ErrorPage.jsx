import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function ErrorPage() {
    const navigate = useNavigate();
  return (
    <div style={{zIndex: "123456"  , width:"100vw" , height:"100vh" , color:"black" , fontSize:"larger"}}>
        <h1>Page Not Found</h1>
        <br />
        <p>Go back to <button className="button" onClick={() => navigate("/")}>
              add data
            </button></p>
    </div>
  )
}

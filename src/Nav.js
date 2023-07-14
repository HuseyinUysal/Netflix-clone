import React from 'react'
import './Nav.css'

function Nav() {
  return (
    <div className="nav">
        <div className='nav__contents'>
            <img className='nav__logo' 
            src='https://www.edigitalagency.com.au/wp-content/uploads/Netflix-logo-red-black-png.png'  
           alt='' />

            <img className='nav__avatar' 
            src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
            alt='' />
        </div>
    </div>
  )
}

export default Nav;
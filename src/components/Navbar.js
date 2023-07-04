import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonalOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

function Navbar() {

    const navigate= useNavigate();
    const location= useLocation();
    const checkPath=(route)=>{
        if(location.pathname===route) return true;
        return false;
    }
  return (
    <footer className='navbar'>
        <div className='navbarNav'>
            <ul className='navbarListItems'>
                <li className='navbarListItem' onClick={()=> navigate('/')}>
                    <ExploreIcon fill={checkPath('/') ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p className={checkPath('/')?'navbarListItemNameActive':'navbarListItemName'}>Explore</p>
                </li>
                <li className='navbarListItem'  onClick={()=> navigate('/offers')}>
                    <OfferIcon fill={checkPath('/offers') ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p className={checkPath('/offers')?'navbarListItemNameActive':'navbarListItemName'}>Offers</p>
                </li>
                <li className='navbarListItem'  onClick={()=> navigate('/profile')}>
                    <PersonalOutlineIcon fill={checkPath('/profile') ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p className={checkPath('/profile')?'navbarListItemNameActive':'navbarListItemName'}>Profile</p>
                </li>
            </ul>
        </div>

    </footer>
  )
}

export default Navbar
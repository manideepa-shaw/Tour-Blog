import {React, useContext} from 'react'
import { NavLink } from 'react-router-dom'

import './NavLinks.css'
import { AuthContext } from '../../context/auth-context'
export const NavLinks = (props) => {
    const auth=useContext(AuthContext)
  return (
    <ul className="nav-links">
        <li>    
            <NavLink to='/'>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn&&
        <li>
        <NavLink to='/places'>MY PLACES</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to='/places/new'>NEW PLACE</NavLink>
        </li>}
        {!auth.isLoggedIn && <li>
            <NavLink to='/auth'>AUTHENTICATE</NavLink> 
        </li>}
        {auth.isLoggedIn && <li>
            <button onClick={auth.logout}>LOGOUT</button>
        </li>}
    </ul>
  )
}

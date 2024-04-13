import React, {useState} from 'react'
import { MainHeader } from './MainHeader'
import {Link} from 'react-router-dom'
import './MainNavigation.css'
import { NavLinks } from './NavLinks'
import { SideDrawer } from './SideDrawer'
import { Backdrop } from '../UIElements/Backdrop.js'

export const MainNavigation = () => {
    const [isDrawerOpen, setisDrawerOpen] = useState(false);
    const openLinks=()=>{
        console.log("Clicked")
        if(!isDrawerOpen)
        {
            setisDrawerOpen(true);
        }
        else
        {
            setisDrawerOpen(false);
        }
    }
  return (
    <React.Fragment>
        {isDrawerOpen && <Backdrop onClick={openLinks} /> }
        
        <SideDrawer show={isDrawerOpen} onClick={openLinks}>
            <nav className='main-navigation__drawer-nav'>
                <NavLinks/>
            </nav>
        </SideDrawer>
        <MainHeader>
            <button className='main-navigation__menu-btn' onClick={openLinks}>
                <span />
                <span />
                <span />
            </button>
            <h1 className='main-navigation__title'>
                <Link to='/'>Your Places</Link>
            </h1>
            <nav className='main-navigation__header-nav'>
                <NavLinks/>
            </nav>
        </MainHeader>
    </React.Fragment>
  )
}

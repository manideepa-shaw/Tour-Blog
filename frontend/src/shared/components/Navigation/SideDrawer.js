import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import './SideDrawer.css'
export const SideDrawer = (props) => {
    const x=
    <CSSTransition 
    in={props.show} 
    classNames='slide-in-left' 
    timeout={200} 
    mountOnEnter 
    unmountOnExit >
      <aside className='side-drawer' onClick={props.onClick} >{props.children}</aside>
    </CSSTransition>
  return ReactDOM.createPortal(x,document.getElementById("drawer-hook"))
}

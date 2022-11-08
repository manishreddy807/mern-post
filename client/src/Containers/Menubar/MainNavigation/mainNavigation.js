import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Backdrop from '../Backdrop/backdrop'
import MainHeader from '../MainHeader/mainHeader'
import NavLinks from '../NavLink/navLink'
import SideBar from '../SideBar/sidebar'
import './mainNavigation.css'

export default function MainNavigation() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  let attachedClasses = ['SideDrawer', 'Close']
  if (isSideBarOpen) {
    attachedClasses = ['SideDrawer', 'Open']
  }
  return (
    <>
      {isSideBarOpen && <Backdrop onClick={() => setIsSideBarOpen(false)} />}
      <div className={attachedClasses.join('')}>
        <SideBar open={isSideBarOpen} closed={() => setIsSideBarOpen(false)}>
          <h3 className="text-left mt-2 pl-4">Blog</h3>
          <hr />
          <div>
            <h4>d</h4>
          </div>
        </SideBar>
      </div>
      <MainHeader>
        <button
          type="button"
          className="main-navigation__menu-btn"
          onClick={() => setIsSideBarOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Blog</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  )
}

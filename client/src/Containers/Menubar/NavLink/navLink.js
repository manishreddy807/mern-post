import React, {useContext} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import AuthContext from '../../../context/auth-context'
import './navLink.css'

function NavLinks() {
  const history = useNavigate()
  const auth = useContext(AuthContext)

  const logout = () => {
    auth.logout()
    history('/auth')
  }
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/mypost">My Post</NavLink>
      </li>
      <li>
        <NavLink to="/create">Create Post</NavLink>
      </li>
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login/Register</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </li>
      )}
    </ul>
  )
}

export default NavLinks

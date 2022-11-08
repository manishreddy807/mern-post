import React from 'react'
import './mainHeader.css'

function MainHeader(props) {
  const {children} = props
  return <header className="main-header">{children}</header>
}

export default MainHeader

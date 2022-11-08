import React from 'react'
import './sidebar.css'

export default function SideBar(props) {
  const {children, closed} = props
  return (
    <aside className="side-bar" onClick={closed}>
      {children}
    </aside>
  )
}

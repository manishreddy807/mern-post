/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import './backdrop.css'

export default function Backdrop(props) {
  const {onClick} = props
  return <div type="button" className="backdrop" onClick={onClick} />
}

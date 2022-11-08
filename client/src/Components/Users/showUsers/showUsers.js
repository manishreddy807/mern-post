import React from 'react'
import {Link} from 'react-router-dom'
import ToText from '../../../utils/ToText'

export default function ShowUser(props) {
  const {username, bio, imagePath} = props
  return (
    <div>
      <ul>
        <li>
          <Link to={`/public${username}`}>
            <img src={imagePath} alt={username} />
          </Link>
          <div className="podcaster">
            <Link to={`/public${username}`}>
              <span>{username}</span>
              <span>{`${ToText(bio.substring(0, 80))}...`}</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  )
}

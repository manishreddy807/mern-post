/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link, useLocation} from 'react-router-dom'
import Spinner from '../../../Containers/Spinner/Spinner'
import ToText from '../../../utils/ToText'
import './showPost.css'

export default function ShowPost(props) {
  const [post, setPost] = useState(props)
  const [isloading, setIsloading] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [errCode, setErrCode] = useState()
  const history = useLocation()
  const {pathname} = history

  const {imagePath, creator, title, content, id} = props

  useEffect(() => {
    setIsloading(true)
    axios
      .get(`/profile/bycreator${creator}`)
      .then(data => {
        setIsloading(false)
        setPost({...props, user: data.data.profile})
      })
      .catch(e => {
        setErrCode('400')
        setErrMsg('error')
      })
  }, [props])

  return (
    <>
      {errCode ? (
        <div className="container error container-short">
          <div className="mar-20">
            <h5>Error Code - {errCode}</h5>
            <h4>Error Message - {errMsg}</h4>
          </div>
        </div>
      ) : null}
      {isloading ? (
        <div className="container loading">
          <div className="mar-20">
            <Spinner />
          </div>
        </div>
      ) : null}
      <div className="col-md-6 col-sm-6 col-xs-12 showblog mb-3">
        <div className="showblog_card card">
          <div
            className="showblog_card_image"
            style={{backgroundImage: `url(${imagePath})`}}
          >
            <Link
              to={`/public/${post.user?.username}`}
              style={{
                backgroundImage: `url(${
                  post.user?.imagePath ? post.user.imagePath : 'avatar'
                })`,
              }}
            >
              By
            </Link>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title pt-3">
            {pathname === '/mypost' ? (
              <Link to={`/mypost/${post._id}`} className="title">
                {title}
              </Link>
            ) : (
              <Link to={`/post/${post._id}`} className="title">
                {title}
              </Link>
            )}
          </h5>
          <p className="showblog_content">
            {`${ToText(content.substring(0, 80))}...`}
            <span>
              {' '}
              <b>Read more</b>
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

/* eslint-disable no-unused-vars */
import axios from 'axios'
import React from 'react'
import {Link} from 'react-router-dom'
import Spinner from '../../../Containers/Spinner/Spinner'
import withRouter from '../../../utils/withRouter'
import ShowPost from '../../Posts/showPosts/showPosts'

class Profile extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {},
      posts: [],
      isloading: false,
      error: {
        message: '',
        code: '',
      },
    }
  }

  componentDidMount() {
    const {router} = this.props
    const {user, posts} = this.state
    this.setState(prev => ({
      isloading: true,
    }))
    const {path} = router.navigate

    const {id} = router.params
    const getProfileData = JSON.parse(localStorage.getItem('profileData'))
    if (!getProfileData && path === '/profile') {
      router.navigate('/createprofile')
    }
    if (id) {
      axios
        .get(`/profile/${id}`)
        .then(data => {
          this.setState({
            isloading: false,
            ...user,
            user: data.data.profile,
          })
          return axios.get(`/profile/${id}/mypost`)
        })
        .then(data => {
          this.setState({
            isloading: false,
            ...posts,
            posts: data.data.posts,
          })
        })
        .catch(e => {
          this.setState({
            isloading: false,
            error: {
              message: e.response.data.message,
              code: e.response.code,
            },
          })
        })
    } else {
      let id1
      axios
        .get('/profile/viewprofile')
        .then(data => {
          id1 = data.data.profile.username
          this.setState({
            isloading: false,
            ...user,
            user: data.data.user,
          })
          axios.get(`/profile/${id1}/mypost`).then(newdata => {
            this.setState({
              isloading: false,
              ...posts,
              posts: newdata.data.posts,
            })
          })
        })
        .catch(e => {
          this.setState({
            isloading: false,
            error: {
              message: e.response.data.message,
              code: e.response.code,
            },
          })
        })
    }
  }

  render() {
    const {isloading, error, user, posts} = this.state
    const {router} = this.props
    let isLoading
    let isError

    const {path} = router.navigate
    const storedData = JSON.parse(localStorage.getItem('profiledata'))
    const profile = user

    let fetchedData
    if (posts) {
      fetchedData = posts.map((post, index) => (
        <ShowPost key={post.id} {...post} {...index} />
      ))
    }

    if (isloading) {
      isLoading = (
        <div className="container loading">
          <div className="mar-20">
            <Spinner />
          </div>
        </div>
      )
    }

    if (error.code) {
      isError = (
        <div className="container error container-short">
          <div className="mar-20">
            <h5>Error Code - {error.code}</h5>
            <h4>Error Message- {error.message}</h4>
          </div>
        </div>
      )
    }

    return (
      <>
        {isLoading}
        {isError}
        <div className="container">
          <div className="row profile">
            <div className="">
              <h2>{profile.username}</h2>
              {!storedData && path !== '/profile' ? null : (
                <Link to={`/profile/edit/${profile.id}`}>Edit Profile</Link>
              )}
              <p>{profile.bio}</p>
            </div>
            <div>
              <img src={profile.imagePath} alt={profile.username} />
            </div>
          </div>
          <div>
            <h2>{profile.username}</h2>
            <hr />
            {posts.length === 0 ? <h2>No posts found</h2> : null}
            <div className="row">{fetchedData}</div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Profile)

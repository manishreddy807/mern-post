/* eslint-disable no-unused-vars */
import axios from 'axios'
import React from 'react'
import Spinner from '../../Containers/Spinner/Spinner'
import ShowUser from '../Users/showUsers/showUsers'
import ShowPost from './showPosts/showPosts'

export default class Posts extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      users: [],
      isloading: false,
    }
  }

  componentDidMount() {
    const {posts, users} = this.state
    this.setState(prev => ({
      isloading: true,
    }))
    Promise.all([axios.get('/posts'), axios.get('/profile/profiles')])
      .then(data => {
        this.setState(pre => ({
          isloading: false,
        }))
        this.setState({...posts, posts: data[0].data.posts})
        this.setState({...users, users: data[1].data.users})
      })
      .catch(e => {
        this.setState(pre => ({
          isloading: false,
        }))
      })
  }

  render() {
    const {isloading, posts, users} = this.state
    let isLoading
    if (isloading) {
      isLoading = <Spinner />
    }
    let fetchedPosts
    let allUsers
    if (posts) {
      fetchedPosts = posts.map((post, index) => (
        <ShowPost key={post.id} {...post} {...index} />
      ))
    }

    if (users) {
      allUsers = users.map((user, index) => (
        <ShowUser key={user.id} {...user} {...index} />
      ))
    }

    return (
      <>
        <div className="container ">
          <div className="row align-items-center text-center">
            <div className="col-lg-4">
              <h1 className="mb-3 display-3">Blog</h1>
              <p>Join with us! Login or Register. Write and share your blog</p>
            </div>
          </div>
          <div className="container hero py-5">
            <div className="row">
              <div className="col-md-8 col-xs-12">
                <div className="row">{fetchedPosts}</div>
              </div>
              <div className="col-md-4 col-xs-12">
                <h3>popular</h3>
                <hr />
                {allUsers}
              </div>
            </div>
          </div>
        </div>

        <div>{isLoading}</div>
      </>
    )
  }
}

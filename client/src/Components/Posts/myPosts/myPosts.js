/* eslint-disable no-unused-vars */
import Axios from 'axios'
import React from 'react'
import Spinner from '../../../Containers/Spinner/Spinner'
import ShowPost from '../showPosts/showPosts'

export default class MyPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      error: {
        msg: '',
        code: '',
      },
      isLoading: false,
    }
  }

  componentDidMount() {
    const {posts, error} = this.state
    console.log('po', posts)
    this.setState(prev => ({
      isLoading: true,
    }))
    Axios.get('/posts/mypost')
      .then(data => {
        console.log(data, 'd')
        this.setState({
          ...posts,
          posts: data.posts,
          isLoading: false,
        })
      })
      .catch(e => {
        this.setState({
          isLoading: false,
          error: {
            ...error,
            msg: e.response.data.message,
            code: e.response.status,
          },
        })
      })
  }

  render() {
    const {isLoading, posts, error} = this.state
    let isloading
    if (isLoading) {
      isloading = <Spinner />
    }
    let isError
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

    let fetchedPosts

    if (posts) {
      fetchedPosts = posts.map((post, index) => (
        <ShowPost key={post.id} {...post} {...index} />
      ))
    }

    return (
      <>
        {isloading}
        {isError}
        <div className="container hero py-5">
          <div className="row">
            <div className="col-md-12 col-xs-12">
              {posts.length === 0 ? (
                <h2 className="text-center">no posts found</h2>
              ) : (
                <div className="row">{fetchedPosts}</div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

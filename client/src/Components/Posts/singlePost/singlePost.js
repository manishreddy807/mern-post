/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import axios from 'axios'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Spinner from '../../../Containers/Spinner/Spinner'

export default class SinglePost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singlePost: {},
      error: {
        msg: '',
        code: '',
      },
      isLoading: false,
    }
  }

  componentDidMount() {
    const {match} = this.props
    const {singlePost, error} = this.state
    this.setState(prev => ({
      isLoading: true,
    }))
    const {id} = match.params

    axios
      .get(`/posts${id}`)
      .then(res => {
        this.setState({
          isLoading: false,
          ...singlePost,
          singlePost: res.data,
        })
        return axios.get('/profile/bycreator', res.data.creator)
      })
      .then(data => {
        this.setState({
          isLoading: false,
          ...singlePost,
          user: data.data.profile,
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
    const {match} = this.props
    const {isLoading, error, post} = this.state
    let isloading
    let isError
    if (isLoading) {
      isloading = (
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
        {isloading}
        {isError}
        <div className="container py-4 singleblog">
          <div className="row">
            {match.path === '/mypost/:id' && (
              <div>
                <div>
                  <Link to={`/edit${post.id}`}>Edit</Link>
                  <button type="button" onClick={this.showModal}>
                    Delete
                  </button>
                </div>
              </div>
            )}
            <div>fg</div>
          </div>
        </div>
      </>
    )
  }
}

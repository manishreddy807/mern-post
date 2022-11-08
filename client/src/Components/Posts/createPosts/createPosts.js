/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../../../Containers/Spinner/Spinner'
import ImageUpload from '../../../Containers/ImageUploads/ImageUpload'

function withParams(Component) {
  // eslint-disable-next-line func-names
  return function (props) {
    return <Component {...props} params={useParams()} />
  }
}

class CreatePost extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      Post: {
        id: '',
        title: '',
        content: '',
        imagePath: '',
        created: '',
      },
      error: {
        message: '',
        code: '',
      },
      isloading: false,
      hasError: false,
      errors: {
        title: '',
        imagePath: '',
        content: '',
      },
    }
    this.submitHandler = this.submitHandler.bind(this)
    this.myChangeHandler = this.myChangeHandler.bind(this)
  }

  componentDidMount() {
    const {Post} = this.state
    const path = this.props.match
    const {id} = this.props.params
    if (path === '/edit/:id') {
      this.setState(pre => ({
        isloading: true,
      }))
      axios
        .get(`/posts/${id}`)
        .then(data => {
          const post = data.data
          console.log('ps', post)
          this.setState({
            isloading: false,
            Post: {
              ...Post,
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            },
          })
        })
        .catch(e => {
          this.setState({
            isloading: false,
            errors: {
              message: e.response.data.message,
              code: e.response.code,
            },
          })
        })
    }
  }

  imageHandler = (id, value, isValid) => {
    const {Post} = this.state
    this.setState({Post: {...Post, [id]: value}}, () => {})
  }

  submitHandler = event => {
    this.setState(prev => ({
      isloading: true,
    }))
    const {Post, error} = this.state
    const {match, router} = this.props
    const {path} = match
    const {id} = this.props.params
    const date = new Date()
    event.preventDefault()
    let formData
    if (typeof Post.imagePath === 'object') {
      formData = new FormData()
      formData.append('id', Post.id)
      formData.append('title', Post.title)
      formData.append('content', Post.content)
      formData.append('image', Post.imagePath, Post.title)
      formData.append('postDate', date.toString())
    } else {
      formData = {
        id: Post.id,
        title: Post.title,
        content: Post.content,
        image: Post.imagePath,
        postDate: date.toString(),
      }
    }
    if (path === '/edit/:id') {
      axios
        .put(`/posts${id}`, formData)
        .then(data => {
          this.setState(prev => ({
            isloading: false,
          }))
          router.navigate('/')
        })
        .catch(e => {
          this.setState({
            isLoading: false,
            error: {
              ...error,
              message: e.response.data.message,
              code: e.response.status,
            },
          })
        })
    } else {
      axios
        .post('/posts', formData)
        .then(data => {
          this.setState(prev => ({
            isloading: false,
          }))
          router.navigate('/')
        })
        .catch(e => {
          this.setState({
            isLoading: false,
            error: {
              ...error,
              message: e.response.data.message,
              code: e.response.status,
            },
          })
        })
    }
    this.setState({
      Post: {...Post, title: '', content: '', imagePath: ''},
    })
  }

  myChangeHandler = e => {
    const nam = e.target?.name
    const val = e.target?.value
    const {errors, Post} = this.state
    const {name, value} = e.target
    switch (name) {
      case 'title':
        if (value.length > 0) {
          errors.title =
            value.length < 6 ? 'Title must be 5 charcters long!' : ''
          break
        }
        if (value.length === 0) {
          errors.title = value.length === 0 ? 'title is required!' : ''
          break
        }
        break

      case 'content':
        if (value.length > 0) {
          errors.content =
            value.length < 20 ? 'Content must be 20 characters long!' : ''
        }
        if (value.length === 0) {
          errors.content = value.length === 0 ? 'Content is required!' : ''
        }
        break

      case 'imagepath':
        if (value.length === 0) {
          errors.imagePath = value.length === 0 ? 'Image is required!' : 'err'
        }
        break
      default:
        break
    }
    this.setState({...errors, Post: {...Post, [nam]: val}}, () => {})
  }

  render() {
    let isLoad
    let isError
    const {isloading, error, Post, errors} = this.state
    if (isloading) {
      isLoad = (
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
    console.log(Post.imagePath, 'pi')
    return (
      <>
        {isLoad}
        {isError}
        <div className="container container-short ">
          <form onSubmit={this.submitHandler} className="pt-4">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="title"
                name="title"
                value={Post.title}
                placeholder="Enter your Title"
                required
                onChange={this.myChangeHandler}
                className={`form-control${errors.title ? 'is-invalid' : ''}`}
              />
              {errors.title.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">{errors.title}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="content">Description</label>
              <textarea
                type="text"
                name="content"
                rows="4"
                value={Post.content}
                placeholder="Enter your Content"
                required
                onChange={this.myChangeHandler}
                className={`form-control${errors.content ? 'is-invalid' : ''}`}
              />
              {errors.content.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">{errors.content}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="imagepath">Image</label>
              <ImageUpload
                id="imagepath"
                name="imagepath"
                onInput={this.imageHandler}
                value={Post.imagePath}
                errorText="Please provide an Image"
              />
              {errors.imagePath.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">{errors.imagePath}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <button
                style={{marginRight: '15px'}}
                type="submit"
                className="btn btn-primary"
                // disabled={
                //   Post.title && Post.content && Post.imagePath ? '' : 'disabled'
                // }
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default withParams(CreatePost)

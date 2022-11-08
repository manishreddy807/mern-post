/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import axios from 'axios'
import React, {Component} from 'react'
import ImageUpload from '../../../Containers/ImageUploads/ImageUpload'
import Spinner from '../../../Containers/Spinner/Spinner'
import withRouter from '../../../utils/withRouter'

class CreateProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Post: {
        id: '',
        username: '',
        bio: '',
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
        username: '',
        imagePath: '',
        bio: '',
      },
    }
    this.mySubmitHandler = this.mySubmitHandler.bind(this)
    this.myChangeHandler = this.myChangeHandler.bind(this)
  }

  componentDidMount() {
    const {router} = this.props
    const {Post} = this.state
    const {path} = router.navigate
    // let id = this.props.match.params.id
    if (path === '/profile/edit/:id') {
      this.setState(prev => ({
        isloading: true,
      }))
      axios
        .get('/profile/viewprofile')
        .then(res => {
          const {post} = res.data
          this.setState({
            isloading: false,
            Post: {
              ...Post,
              id: post.id,
              username: post.username,
              bio: post.bio,
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

  myChangeHandler = e => {
    const nam = e.target.name
    const val = e.target.value
    const {errors, Post} = this.state
    const {name, value} = e.target

    switch (name) {
      case 'username':
        if (value.length === 0) {
          errors.username = value.length < 6 ? 'Title must be 5 charcters' : ''
          break
        }
        if (value.length === 0) {
          errors.username = value.length === 0 ? 'title is required' : ''
          break
        }
        break

      case 'bio':
        if (value.length > 0) {
          errors.bio = value.length < 20 ? 'Content must be 20 character' : ''
        }
        if (value.length === 0) {
          errors.bio = value.length === 0 ? 'Content is required!' : ''
        }
        break

      case 'imagepath':
        if (value.length === 0) {
          errors.imagePath = value.length === 0 ? 'Image is required!' : ''
        }
        break
      default:
        break
    }
    this.setState({errors, Post: {...Post, [nam]: val}}, () => {})
  }

  mySubmitHandler(e) {
    const {match, router} = this.props
    this.setState(prev => ({
      isloading: true,
    }))
    e.preventDefault()
    const {path} = match
    const {id} = match.params
    const {Post, error} = this.state
    let formData
    if (typeof (Post.imagePath === 'object')) {
      formData = new FormData()
      formData.append('id', Post.id)
      formData.append('username', Post.username)
      formData.append('bio', Post.bio)
      formData.append('imagePath', Post.imagePath, Post.username)
    } else {
      formData = {
        id: Post.id,
        username: Post.username,
        bio: Post.bio,
        image: Post.imagePath,
      }
    }
    if (path === '/profile/edit/:id') {
      axios
        .put(`/profile/edit${id}`, formData)
        .then(data => {
          this.setState({
            isloading: false,
          })
          router.navigate('/')
        })
        .catch(e1 => {
          this.setState({
            isloading: false,
            error: {
              ...error,
              message: e1.response.data.message,
              code: e1.response.status,
            },
          })
        })
    } else {
      axios
        .post('/profile/create', formData)
        .then(data => {
          this.setState({
            isloading: false,
          })
          const profile = data.data.profile.username
          localStorage.setItem(
            'profileData',
            JSON.stringify({
              username: profile,
            }),
          )
          router.navigate('/')
        })
        .catch(e2 => {
          this.setState({
            isloading: false,
            error: {
              ...error,
              message: e2.response.data.message,
              code: e2.response.status,
            },
          })
        })
    }
  }

  render() {
    const {Post, errors, isloading, error} = this.state
    const {username, bio, imagePath} = Post
    let isLoading
    let isError

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
        <div className="container short">
          <form onSubmit={this.mySubmitHandler}>
            <div className="form-group">
              <label htmlFor="username">Title</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={username}
                required
                onChange={this.myChangeHandler}
                className={`form-control${username}` ? 'is-invalid' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Description</label>
              <input
                id="bio"
                name="bio"
                type="text"
                placeholder="Enter description"
                value={bio}
                required
                onChange={this.myChangeHandler}
                className={`form-control${bio}` ? 'is-invalid' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imagepath">Image</label>
              <ImageUpload
                id="imagepath"
                name="imagepath"
                onInput={this.imageHandler}
                value={imagePath}
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
                disabled={username && bio && (imagePath ? '' : 'disabled')}
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

export default withRouter(CreateProfile)

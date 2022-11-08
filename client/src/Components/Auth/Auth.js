/* eslint-disable no-unused-vars */
import React from 'react'
import Axios from 'axios'
import Cookies from 'js-cookies'
import AuthContext from '../../context/auth-context'
import validateForm from '../../utils/validateform'
import validEmailRegex from '../../utils/emailRegex'
import './Auth.css'
import Spinner from '../../Containers/Spinner/Spinner'
import withRouter from '../../utils/withRouter'

class Auth extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = AuthContext

  constructor(props) {
    super(props)

    this.state = {
      user: {
        email: '',
        password: '',
      },
      error: {
        message: '',
        code: '',
      },
      isLoading: false,
      isLoginMode: true,
      errors: {
        email: '',
        password: '',
      },
    }
  }

  handleSubmit = e => {
    const {errors, user, error, isLoginMode} = this.state
    const {router} = this.props
    this.setState(() => ({
      isLoading: true,
    }))
    const auth = this.context
    e.preventDefault()

    if (validateForm(errors)) {
      console.log('er')
    } else {
      console.log('err')
    }
    if (isLoginMode) {
      Axios.post('/user/login', user)
        .then(res => {
          this.setState(prev => ({
            isLoading: false,
          }))

          router.navigate('/')
          const token = Cookies.setItem('js-cookie', res.data.token)
          auth.login(res.data.userId, token)
          return Axios.get('/profile/viewprofile')
        })
        .then(data => {
          console.log('data', data)
          const profile = data.data.profile.username
          localStorage.setItem(
            'profileData',
            JSON.stringify({
              username: profile,
            }),
          )
        })
        .catch(e3 => {
          this.setState({
            isLoading: false,
            error: {
              ...error,
              message: 'error',
              code: '400',
            },
          })
          console.log(e3)
        })
    } else {
      this.setState(prev => ({
        isLoading: true,
      }))
      Axios.post('/user/signup', user)
        .then(res => {
          this.setState(prev => ({
            isLoading: false,
          }))
          console.log('res', res)
        })
        .catch(e4 => {
          this.setState({error: true})
        })
    }
    this.setState({
      user: {...user, email: '', password: ''},
    })
  }

  myChangeHandler = e => {
    const nam = e.target.name
    const val = e.target.value
    const {errors, user} = this.state
    const {name, value} = e.target
    switch (name) {
      case 'email':
        if (value.length === 0) {
          errors.email = value.length < 5 ? 'Email is Required' : ''
          break
        }
        if (value.length > 0) {
          errors.email = validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!'
          break
        }
        break

      case 'password':
        if (value.length > 0) {
          errors.password =
            value.length < 6 ? 'Password must be 6 character' : ''
        }
        if (value.length === 0) {
          errors.password = value.length === 0 ? 'Password is required!' : ''
        }
        break

      default:
        break
    }
    this.setState({errors, user: {...user, [nam]: val}}, () => {})
  }

  swicthLoginhandler = () => {
    this.setState(pre => ({
      isLoginMode: !pre.isLoginMode,
    }))
  }

  render() {
    let isLoad
    let isError
    const {isLoading, isLoginMode, errors, user, error} = this.state
    const {email, password} = user
    if (isLoading) {
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
    return (
      <>
        {isLoad}
        {isError}
        <div className="container container-short py-5">
          <h1 className="pt-2 py-2">{isLoginMode ? 'Login' : 'Signup'}</h1>
          <hr />
          <form onSubmit={this.handleSubmit} className="pt-4">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                required
                onChange={this.myChangeHandler}
                className={`form-control${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">{errors.email}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                value={password}
                required
                placeholder="Enter your password"
                onChange={this.myChangeHandler}
                data-error="please enter your full name"
                className={`form-control${errors.password ? 'is-invalid' : ''}`}
              />
              {errors.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">{errors.password}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <button
                style={{marginRight: '15px'}}
                type="submit"
                className="btn btn-primary"
                disabled={
                  user.email && user.password && validateForm(errors)
                    ? ''
                    : 'disabled'
                }
              >
                {isLoginMode ? 'login' : 'signup'}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.swicthLoginhandler}
              >
                Switch to {isLoginMode ? 'SignUp' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default withRouter(Auth)

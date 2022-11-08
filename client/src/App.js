import axios from 'axios'
import React, {useCallback, useEffect, useState, useMemo} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Auth from './Components/Auth/Auth'
import AuthContext from './context/auth-context'
import Spinner from './Containers/Spinner/Spinner'
import Posts from './Components/Posts/posts'
import CreatePost from './Components/Posts/createPosts/createPosts'
import CreateProfile from './Components/Users/createProfile/createProfile'
import MyPost from './Components/Posts/myPosts/myPosts'
import SinglePost from './Components/Posts/singlePost/singlePost'
import Profile from './Components/Users/profile/profile'
import MainNavigation from './Containers/Menubar/MainNavigation/mainNavigation'
import './App.css'

function App() {
  const [token, setToken] = useState(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback((uid, newToken, expirationDate) => {
    setToken(newToken)
    setUserId(uid)
    setIsLoading(false)
    const newTokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(newTokenExpirationDate)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        newToken,
        expiration: newTokenExpirationDate.toISOString(),
      }),
    )
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    localStorage.removeItem('userData')
    localStorage.removeItem('profileData')
    const token1 = null
    axios.defaults.headers.common.Authorization = `Bearer ${token1}`
  }, [])

  let logoutTimer

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    setIsLoading(false)
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      )
    }
  }, [login])

  let route
  let loading
  if (isLoading) {
    loading = (
      <div className="container loading">
        <div className="mar-20">
          <Spinner />
        </div>
      </div>
    )
  } else {
    route = (
      <>
        <Route
          path="/create"
          exact
          element={token ? <CreatePost /> : <Navigate to="/auth" />}
        />
        <Route
          path="/createprofile"
          exact
          element={token ? <CreateProfile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/edit/:id"
          exact
          element={token ? <CreatePost /> : <Navigate to="/auth" />}
        />
        <Route
          path="/mypost"
          exact
          element={token ? <MyPost /> : <Navigate to="/auth" />}
        />
        <Route
          path="/mypost/:id"
          exact
          element={token ? <SinglePost /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          exact
          element={token ? <Profile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile/edit/:id"
          exact
          element={token ? <CreateProfile /> : <Navigate to="/auth" />}
        />
      </>
    )
  }

  const memoValue = useMemo(
    () => ({
      isLoggedIn: !!token,
      token,
      userId,
      login,
      logout,
    }),
    [token, userId, login, logout],
  )

  return (
    <AuthContext.Provider value={memoValue}>
      <div className="App">
        <BrowserRouter>
          <MainNavigation />
          <Routes>
            <Route path="/post/:id" exact element={<SinglePost />} />
            <Route exact path="/public/:id" element={<Profile />} />
            <Route path="/auth" element={<Auth />} exact />
            <Route exact path="/" element={<Posts />} />
            {route}
          </Routes>
        </BrowserRouter>
        {loading}
      </div>
    </AuthContext.Provider>
  )
}

export default App

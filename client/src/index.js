import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from 'axios'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery'

setInterval(async () => {
  axios
    .get('http://localhost:3004/api/')
    .then(data => {
      console.log(data)
    })
    .catch(e => {
      console.log(e.response)
    })
}, 60 * 1000)

axios.defaults.baseURL = 'http://localhost:3004/api/'
const userData = JSON.parse(localStorage.getItem('userData'))
let token
if (userData) {
  token = userData.token
}

axios.defaults.headers.common.Authorization = `Bearer ${token}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  request => request,
  error => Promise.reject(error),
)

axios.interceptors.response.use(
  res => res,
  error => Promise.reject(error),
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

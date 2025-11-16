import React from 'react'
import axios from 'axios'
import Home from './pages/Home'
const App = () => {
  axios.get('http://localhost:8080/',{withCredentials:true})
  .then((data)=>console.log(data))
  .catch(err=>console.log(err))
  return (
    <Home />

  )
}

export default App
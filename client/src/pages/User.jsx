import React from 'react'

const User = () => {
    axios.get("http://localhost:8080/user")
  return (
    <h1>user</h1>
  )
}

export default User 
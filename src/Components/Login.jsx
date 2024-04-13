import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import '../css/Login.css'
import '../js/Login.js'

function Login() {
  const [count, setCount] = useState(0)

  return (
    <>
        <p>Login or Signup to play!</p>
        <form id="userForm">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Your name here" />
            <label htmlFor="Email">Email:</label>
            <input type="text" id="Email" placeholder="Your Email here" />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" placeholder="Your Password here" />
            <button type="submit" id="loginBtn">Login</button>
            <button type="submit" id="signupBtn">Signup</button>
        </form>
        <h2>Current Cases Available!</h2>
        <div className="picture-box"><img width="350" length="350" src="Pet_Case__1-removebg-preview.png" alt="random" /></div>
        <h2>Rarest pet ever pulled!</h2>
        <ul id="rarest-pet-pulled"></ul>
    </>
  )
}

export default Login

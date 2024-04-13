import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import '../css/Instructions.css'
import '../js/Instructions.js'

function Instructions() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="steps">
            <h1>Instructions</h1>
            <p>What to do!
                <ol>
                    <li>Make Your Account!</li>
                    <li>Choose Your Case!</li>
                    <li>Spin!</li>
                    <li>WIN!!!🥳</li>
                </ol>
            </p>
        </div>
        <img id="randomdog" width="300" height="300" alt="random dog"></img>
    </>
  )
}

export default Instructions

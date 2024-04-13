import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import '../css/Hub.css'
import '../js/Hub.js'

function Hub() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h2>YOU MUST LOG IN</h2>
        <div className="main-contents">
            <div className="main-screen">
                <div className="pets">
                    <span className="users-pet">Your Username - Red Dragon - 0.001%</span>
                </div>
                    <p className="rarest-pet">Recent Pet's Pulled!</p>
                    <div className="notification-wrapper">
                        <ol className="notification">
                            <li className="player-name"> Bob pulled Red Dragon - 0.001%</li>
                            <li className="player-name">Lenicha_likes_you pulled Yellow Teddy Bear - 0.01%</li>
                            <li className="player-name">Your_not_cool pulled Lame Teddy Bear - 15%</li>
                        </ol>
                    </div>
            </div>
            <div className="main-screen">
                <h2>
                    Current Case's Available!
                </h2>
                <div id="picture" className="picture-box">
                    <img width="350" length="350" src="Pet_Case__1-removebg-preview.png" alt="random" />
                </div>
            </div>
            <div className="main-screen">
                <p className="number-of-cases-announcment">Total Number of Cases Opened World Wide
                    <span id="count">: 0</span>
                </p>
            </div>
        </div>
    </>
  )
}

export default Hub

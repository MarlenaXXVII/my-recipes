import { useState } from 'react'
import appLogo from './assets/appLogo.svg'
import {Routes, Route, Link, NavLink} from 'react-router-dom';
import Homepage from './pages/homePage/homePage.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <nav>
            <div className="navigation container">
                <div className="logo">
                    <NavLink to="/">
                        <img src={appLogo} alt="recipe-app-logo" />
                    </NavLink>
                </div>
                <ul>
                    <li>
                        <NavLink to="recepten">Recepten</NavLink>
                    </li>
                </ul>
                <NavLink to="login" className="primaryButton">Inloggen</NavLink>
            </div>
        </nav>
        <div className="container">
            <Routes>
                <Route path="/" element={<Homepage />}/>
                <Route path="/recepten" element={<p>recepten</p>}/>
                <Route path="/login" element={<p>Inloggen</p>}/>
                <Route path="*" element={<p>*</p>}/>
            </Routes>
        </div>
        <footer>
            <div className="footer container">@2026 Recepten app</div>
        </footer>
    </>
  )
}

export default App

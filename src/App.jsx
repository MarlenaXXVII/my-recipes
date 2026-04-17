import appLogo from './assets/appLogo.svg'
import {Routes, Route, NavLink, Navigate} from 'react-router-dom';
import Auth from './pages/auth/auth.jsx';
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext.jsx";
import Homepage from './pages/homePage/homePage.jsx';
import NewRecipe from './pages/newRecipe/newRecipe.jsx';
import AllRecipe from './pages/recipeOverview/recipeOverview.jsx';
import RecipeDetail from './pages/recipeDetail/recipeDetail.jsx';
import './App.css'

function App() {
    const { isAuth } = useContext(AuthContext);

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
            <div className="body">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Homepage />}/>
                        <Route path="/alle-recepten" element={<AllRecipe />}/>
                        <Route path="/recept/:id" element={<RecipeDetail />}/>
                        <Route path="/nieuw-recept" element={isAuth ? <NewRecipe /> : <Navigate to="/login" state={{ message: "Om een recept aan te maken moet je ingelogd zijn" }}/>} />
                        <Route path="/mijn-recepten" element={<AllRecipe onlyMine={true} />} />
                        <Route path="/login" element={<Auth />}/>
                        <Route path="*" element={<p>*</p>}/>
                    </Routes>
                </div>
            </div>
            <footer>
                <div className="footer container">@2026 Recepten app</div>
            </footer>
        </>
      )
    }

export default App

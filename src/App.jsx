import appLogo from './assets/appLogo.svg'
import {Routes, Route, NavLink, Navigate} from 'react-router-dom';
import Auth from './pages/auth/auth.jsx';
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext.jsx";
import Homepage from './pages/homePage/homePage.jsx';
import NewRecipe from './pages/newRecipe/newRecipe.jsx';
import AllRecipe from './pages/recipeOverview/recipeOverview.jsx';
import WeekMenu from './pages/weekMenu/weekMenu.jsx';
import GroceryList from './pages/shoppingList/shoppingList.jsx';
import RecipeDetail from './pages/recipeDetail/recipeDetail.jsx';
import './App.css'

function App() {
    // TODO: Add a name to the logged in user in navigation

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
                            <NavLink to="alle-recepten">Recepten</NavLink>
                        </li>
                    </ul>
                    {isAuth ? <p>Hallo Gebruiker!</p> : <NavLink to="login" className="primaryButton">Inloggen</NavLink>}
                </div>
            </nav>
            <main className="body">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Homepage />}/>
                        <Route path="/alle-recepten" element={<AllRecipe />}/>
                        <Route path="/recept/:id" element={<RecipeDetail />}/>
                        <Route path="/nieuw-recept" element={isAuth ? <NewRecipe /> : <Navigate to="/login" state={{ message: "Om een recept aan te maken moet je ingelogd zijn" }}/>} />
                        <Route path="/mijn-recepten" element={isAuth ? <AllRecipe onlyMine={true} /> : <Navigate to="/login" state={{ message: "Log in om je eigen recepten te bekijken" }}/>}/>
                        <Route path="/boodschappenlijst" element={isAuth ? <GroceryList /> : <Navigate to="/login" state={{ message: "Om een boodschappenlijst aan te maken moet je ingelogd zijn" }}/>} />
                        <Route path="/weekmenu" element={isAuth ? <WeekMenu /> : <Navigate to="/login" state={{ message: "Om een weekmenu aan te maken moet je ingelogd zijn" }}/>} />
                        <Route path="/login" element={<Auth />}/>
                        <Route path="*" element={<p>*</p>}/>
                    </Routes>
                </div>
            </main>
            <footer>
                <div className="container">
                    <div className="footer container">@2026 Recepten app</div>
                </div>
            </footer>
        </>
      )
    }

export default App

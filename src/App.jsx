import appLogo from './assets/appLogo.svg'
import {Routes, Route, NavLink} from 'react-router-dom';
import Homepage from './pages/homePage/homePage.jsx';
import NewRecipe from './pages/newRecipe/newRecipe.jsx';
import AllRecipe from './pages/recipeOverview/recipeOverview.jsx';
import RecipeDetail from './pages/recipeDetail/recipeDetail.jsx';
import './App.css'
import WeekMenu from "./pages/weekMenu/weekMenu.jsx";

function App() {
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
                    <Route path="/nieuw-recept" element={<NewRecipe />}/>
                    <Route path="/weekmenu" element={<WeekMenu />}/>
                    <Route path="/login" element={<p>Inloggen</p>}/>
                    <Route path="*" element={<p>404 - Deze pagina bestaat niet</p>}/>
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

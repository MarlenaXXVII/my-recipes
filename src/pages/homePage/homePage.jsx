import "./homePage.css";
import HomePageTile from "../../components/HomePageTile.jsx";
import allRecipes from "../../assets/alle-recepten-afbeelding.png";
import weekMenu from "../../assets/groceryList.png";
import groceryList from "../../assets/myRecipes.png";
import myRecipes from "../../assets/newRecipe.png";
import newRecipe from "../../assets/tryThis.png";
import tryThis from "../../assets/weekMenu.png";

function Homepage() {
    return (
        <>
            <div className="intro-wrapper">
                <div className="intro-titles">
                    <h1>
                        Welkom bij Recepten
                    </h1>
                    <p>
                        Plan je maaltijden, beheer je recepten en genereer automatisch je boodschappenlijst.
                    </p>
                </div>
                <div className={"intro-buttons"}>
                    <button className={"primaryButton"} type={"button"}>Aan de slag</button>
                    <button className={"secondaryButton"} type={"button"}>Bekijk recepten</button>
                </div>
            </div>
            <div className="tile-wrapper">
                <HomePageTile imageSrc={allRecipes} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={weekMenu} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={groceryList} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={myRecipes} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={newRecipe} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={tryThis} imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
            </div>
        </>
    )
}

export default Homepage;
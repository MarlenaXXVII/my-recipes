import "./homePage.css";
import HomePageTile from "../../components/HomePageTile.jsx";
import allRecipes from "../../assets/alle-recepten-afbeelding.png";
import weekMenu from "../../assets/weekMenu.png";
import groceryList from "../../assets/groceryList.png";
import myRecipes from "../../assets/myRecipes.png";
import newRecipe from "../../assets/newRecipe.png";
import tryThis from "../../assets/tryThis.png";

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
                <HomePageTile imageSrc={allRecipes} imageLinkTo="alle-recepten" imageAlt="link naar alle recepten" title="Alle recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={weekMenu} imageLinkTo="weekmenu" imageAlt="link naar alle recepten" title="Weekmenu" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={groceryList} imageLinkTo="boodschappenlijst" imageAlt="link naar alle recepten" title="Boodschappenlijst" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={myRecipes} imageLinkTo="mijn-recepten" imageAlt="link naar alle recepten" title="Mijn recepten" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={newRecipe} imageLinkTo="nieuw-recept" imageAlt="link naar alle recepten" title="Nieuw recept" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
                <HomePageTile imageSrc={tryThis} imageLinkTo="random-link" imageAlt="link naar alle recepten" title="Probeer ook eens" subtitle="Bekijk en zoek door alle beschikbare recepten."/>
            </div>
        </>
    )
}

export default Homepage;
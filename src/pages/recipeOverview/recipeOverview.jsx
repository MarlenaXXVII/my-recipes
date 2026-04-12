import './recipeOverview.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {});

    useEffect(() => {
        async function fetchData() {
            try {
                const [recipesResponse, categoriesResponse] = await Promise.all([
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes', {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    }),
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories', {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    })
                ]);

                setRecipes(recipesResponse.data);
                setCategories(categoriesResponse.data);

            } catch (e) {
                console.error(e);
                setError("Er ging iets mis bij het ophalen van data.");
            }
        }

        fetchData();
    }, []);


    return (

        <main className="recipe-page">
            <section className="recipe-hero container">
                <div className="recipe-hero-content">
                    <h1>Recepten</h1>
                    <p>Ontdek heerlijke gerechten</p>

                    <div className="search-bar-wrapper">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Zoek recepten..."
                        />
                    </div>

                    <div className="filter-tags">
                        <button type="button" className="filter-tag active">🍽 Alle</button>
                        <button type="button" className="filter-tag">🍰 Dessert</button>
                        <button type="button" className="filter-tag">🍽 Diner</button>
                        <button type="button" className="filter-tag">🥗 Lunch</button>
                        <button type="button" className="filter-tag">🍳 Ontbijt</button>
                        <button type="button" className="filter-tag">🍝 Pasta</button>
                        <button type="button" className="filter-tag">🥗 Salade</button>
                        <button type="button" className="filter-tag">🍟 Snack</button>
                        <button type="button" className="filter-tag">🍲 Soep</button>
                        <button type="button" className="filter-tag">🌱 Vegan</button>
                        <button type="button" className="filter-tag">🥕 Vegetarisch</button>
                        <button type="button" className="filter-tag">🐟 Vis</button>
                        <button type="button" className="filter-tag">🥩 Vlees</button>
                    </div>
                </div>
            </section>

            <section className="recipe-list-section container">
                {error && <p className="error-message">{error}</p>}

                {!error && recipes.length === 0 && (
                    <p className="loading-message">Recepten worden geladen...</p>
                )}

                {recipes.length > 0 && (
                    <>
                        <div className="recipe-grid">
                            {recipes.map((recipe) => (
                                <article className="recipe-card" key={recipe.id}>
                                    <Link to={`/recept/${recipe.id}`} className="recipe-card-link">
                                        <div className="recipe-card-image-wrapper">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.title}
                                                className="recipe-card-image"
                                            />
                                            <span className="recipe-category-badge">
                                            {categoryMap[recipe.category]}
                                        </span>
                                        </div>

                                        <div className="recipe-card-content">
                                            <h3>{recipe.title}</h3>
                                            <p>{recipe.description}</p>

                                            <div className="recipe-meta">
                                                <span>🕒 {recipe.prepTimeMinutes} min</span>
                                                <span>👥 {recipe.servings}</span>
                                                <span>🔥 {recipe.calories} kcal</span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        <div className="pagination">
                            <button type="button" className="pagination-button">‹</button>
                            <button type="button" className="pagination-button active">1</button>
                            <button type="button" className="pagination-button">2</button>
                            <button type="button" className="pagination-button">3</button>
                            <button type="button" className="pagination-button">›</button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default AllRecipe;
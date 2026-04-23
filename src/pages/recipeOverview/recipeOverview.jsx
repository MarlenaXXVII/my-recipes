import './recipeOverview.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Clock, Users, Flame, ChevronRight, ChevronLeft } from 'lucide-react';
import appLogoOnly from "../../assets/appLogoOnly.svg";

function AllRecipe({ onlyMine = false }) {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [error, setError] = useState("");
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded?.userId;

    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {});

    const recipeCategoryMap = recipeCategories.reduce((acc, item) => {
        if (!acc[item.recipeId]) {
            acc[item.recipeId] = [];
        }
        acc[item.recipeId].push(item.categoryId);
        return acc;
    }, {});

    let filteredRecipes = onlyMine
        ? recipes.filter(recipe => recipe.ownerProfileId === userId)
        : recipes;

    if (selectedCategory !== "all") {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            recipeCategoryMap[recipe.id]?.includes(selectedCategory)
        );
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const [recipesResponse, categoriesResponse, recipeCategoriesResponse] = await Promise.all([
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes', {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    }),
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories', {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    }),
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories', {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    })
                ]);

                setRecipes(recipesResponse.data);
                setCategories(categoriesResponse.data);
                setRecipeCategories(recipeCategoriesResponse.data);

            } catch (e) {
                console.error(e);
                setError("Er ging iets mis bij het ophalen van data.");
            }
        }

        fetchData();
    }, []);

    const BASE_URL = 'https://novi-backend-api-wgsgz.ondigitalocean.app';

    return (
        <main className="recipe-page">
            <section className="recipe-hero container">
                <div className="recipe-hero-content">
                    <h1>{onlyMine ? "Mijn recepten" : "Recepten"}</h1>
                    <p>
                        {onlyMine
                            ? "Dit zijn jouw recepten"
                            : "Ontdek heerlijke gerechten"}
                    </p>

                    <div className="search-bar-wrapper">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Zoek recepten..."
                        />
                    </div>

                    <div className="filter-tags">
                        <button
                            type="button"
                            className={`filter-tag ${selectedCategory === "all" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("all")}
                        >
                            Alle
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`filter-tag ${selectedCategory === category.id ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
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
                            {filteredRecipes.map((recipe) => {
                                const imageSrc = recipe.image
                                    ? recipe.image.base64
                                        ? `data:${recipe.image.contentType};base64,${recipe.image.base64}`
                                        : `${BASE_URL}${recipe.image}`
                                    : appLogoOnly;

                                return (
                                    <article className="recipe-card" key={recipe.id}>
                                        <Link to={`/recept/${recipe.id}`} className="recipe-card-link">
                                            <div className="recipe-card-image-wrapper">
                                                <img
                                                    src={imageSrc}
                                                    alt={recipe.title}
                                                    className="recipe-card-image"
                                                />
                                                {recipeCategoryMap[recipe.id]?.length > 0 && (
                                                    <span className="recipe-category-badge">
                                                        {categoryMap[recipeCategoryMap[recipe.id][0]]}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="recipe-card-content">
                                                <h3>{recipe.title}</h3>
                                                <p>{recipe.description}</p>

                                                <div className="recipe-meta">
                                                    <span><Clock /> {recipe.prepTimeMinutes} min</span>
                                                    <span><Users /> {recipe.servings} pers.</span>
                                                    <span><Flame /> {recipe.calories} kcal</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="pagination">
                            <button type="button" className="pagination-button"><ChevronLeft /></button>
                            <button type="button" className="pagination-button active">1</button>
                            <button type="button" className="pagination-button">2</button>
                            <button type="button" className="pagination-button">3</button>
                            <button type="button" className="pagination-button"><ChevronRight /></button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default AllRecipe;
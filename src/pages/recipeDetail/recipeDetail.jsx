import './recipeDetail.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../helpers/api.js";
import { jwtDecode } from "jwt-decode";
import makeInstructionsReadable from "../../helpers/makeInstructionsReadable.js";
import getRecipeIngredients from "../../helpers/getRecipeIngredients.js";
import getRecipeCategories from "../../helpers/getRecipeCategories.js";
import { Clock, Users, ChefHat } from 'lucide-react';
import appLogoOnly from '../../assets/appLogoOnly.svg';

function RecipeDetail() {
    const [recipe, setRecipe] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    let currentUserId = null;
    let isAdmin = false;

    if (token) {
        const decoded = jwtDecode(token);
        currentUserId = Number(decoded.userId);

        isAdmin =
            decoded.role === 'admin';
    }

    useEffect(() => {
        async function fetchRecipeData() {
            try {
                const [
                    recipeResponse,
                    recipeIngredientsResponse,
                    ingredientsResponse,
                    recipeCategoriesResponse,
                    categoriesResponse,
                ] = await Promise.all([
                    api.get(`/api/recipes/${id}`),
                    api.get("/api/recipe_ingredients"),
                    api.get("/api/ingredients"),
                    api.get("/api/recipe_categories"),
                    api.get("/api/categories"),
                ]);

                const recipeData = recipeResponse.data;
                const recipeIngredients = recipeIngredientsResponse.data;
                const ingredients = ingredientsResponse.data;
                const recipeCategories = recipeCategoriesResponse.data;
                const categories = categoriesResponse.data;

                const currentRecipeIngredients = getRecipeIngredients(
                    recipeIngredients,
                    ingredients,
                    id
                );

                const currentRecipeCategories = getRecipeCategories(
                    recipeCategories,
                    categories,
                    id
                );

                setRecipe(recipeData);
                setRecipeIngredients(currentRecipeIngredients);
                setRecipeCategories(currentRecipeCategories);
            } catch (e) {
                console.error(e);
            }
        }

        fetchRecipeData();
    }, [id]);

    if (!recipe) {
        return (
            <div className="container">
                <div className="recipe-detail-page">
                    <div className="container">
                        <p>Geen recept gevonden.</p>
                    </div>
                </div>
            </div>
        );
    }

    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    const isOwner = Number(recipe.ownerProfileId) === currentUserId;
    const canEdit = isOwner || isAdmin;

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const imageSrc = recipe.image
        ? recipe.image.base64
            ? `data:${recipe.image.contentType};base64,${recipe.image.base64}`
            : `${BASE_URL}${recipe.image}`
        : appLogoOnly;

    return (
        <div className="container">
            <div className="recipe-detail-content">
                <div className="recipe-detail-header">
                    <div className="recipe-title-and-button">
                        <h1>{recipe.title}</h1>
                        {canEdit && (
                            <button
                                type="button"
                                className="primaryButton"
                                onClick={() => navigate(`/recept/bewerk/${recipe.id}`)}
                            >
                                Bewerk recept
                            </button>
                        )}
                    </div>
                    <p className="recipe-description">{recipe.description}</p>

                    <div className="recipe-tags">
                            {recipeCategories.map((category) => (
                                <span className="recipe-tag" key={category.categoryId}>
                                    {category.name}
                                </span>
                            ))}
                    </div>
                </div>

                <div className="recipe-detail-layout">
                    <section className="recipe-detail-main">
                        <div className="recipe-image-wrapper">
                            <img
                                src={imageSrc}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                        </div>

                        <section className="recipe-info-card">
                            <div className="recipe-info-item">
                                <span className="recipe-info-item-icon">
                                    <Clock />
                                </span>
                                <span className="recipe-info-item-text">
                                    <span className="recipe-info-label">Totale tijd</span>
                                    <strong>{totalTime} minuten</strong>
                                </span>
                            </div>

                            <div className="recipe-info-item">
                                <span className="recipe-info-item-icon">
                                    <Users />
                                </span>

                                <span className="recipe-info-item-text">
                                    <span className="recipe-info-label">Porties</span>
                                    <strong>{recipe.servings}</strong>
                                </span>
                            </div>

                            <div className="recipe-info-item">
                                <span className="recipe-info-item-icon">
                                    <ChefHat />
                                </span>

                                <span className="recipe-info-item-text">
                                    <span className="recipe-info-label">Moeilijkheid</span>
                                    <strong>{recipe.difficulty}</strong>
                                </span>
                            </div>
                        </section>

                        <section className="recipe-detail-card">
                            <h3>Bereidingswijze</h3>
                            <p className="recipe-detail-card-subtitle">Zo maak je het</p>

                            <div className="recipe-steps">
                                <ul className="recipe-info-label">
                                    {makeInstructionsReadable(recipe.instructions).map((step, index) => (
                                        <li key={index}>{step}.</li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </section>

                    <aside className="recipe-detail-sidebar">
                        <section className="recipe-detail-card">
                            <h3>Ingrediënten</h3>
                            <p className="recipe-detail-card-subtitle">
                                Voor {recipe.servings} porties
                            </p>

                            <div className="ingredients-list">
                                {recipeIngredients.map((ingredient) => (
                                    <div className="ingredient-row" key={ingredient.id}>
                                        <span>
                                            {ingredient.name}
                                            {ingredient.notes ? ` (${ingredient.notes})` : ''}
                                        </span>
                                        <span>
                                            {ingredient.amount} {ingredient.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="recipe-detail-card">
                            <h3>Voedingswaarde</h3>
                            <p className="recipe-detail-card-subtitle">Per portie</p>

                            <div className="nutrition-list">
                                <div className="nutrition-box">
                                    <strong>{recipe.calories}</strong>
                                    <span>kcal</span>
                                </div>

                                <div className="nutrition-box">
                                    <strong>{recipe.protein}g</strong>
                                    <span>eiwit</span>
                                </div>

                                <div className="nutrition-box">
                                    <strong>{recipe.carbs}g</strong>
                                    <span>koolhydraten</span>
                                </div>

                                <div className="nutrition-box">
                                    <strong>{recipe.fat}g</strong>
                                    <span>vet</span>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;
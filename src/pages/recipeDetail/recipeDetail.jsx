import './recipeDetail.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import makeInstructionsReadable from "../../helpers/makeInstructionsReadable.js";
import getRecipeIngredients from "../../helpers/getRecipeIngredients.js";
import getRecipeCategories from "../../helpers/getRecipeCategories.js";

function RecipeDetail() {
    // TODO: Create headers const for the api call so i dont have to type it out every time
    // TODO: If its your own recipe, add option to edit
    // TODO: If you are admin, add option to edit

    const [recipe, setRecipe] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        async function fetchRecipeData() {
            try {
                const [recipeResponse, recipeIngredientsResponse, ingredientsResponse, recipeCategoriesResponse, categoriesResponse ] = await Promise.all([
                    axios.get(
                        `https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes/${id}`,
                        {
                            headers: {
                                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            },
                        }
                    ),
                    axios.get(
                        `https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients`,
                        {
                            headers: {
                                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            },
                        }
                    ),
                    axios.get(
                        `https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients`,
                        {
                            headers: {
                                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            },
                        }
                    ),
                    axios.get(
                        `https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories`,
                        {
                            headers: {
                                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            },
                        }
                    ),
                    axios.get(
                        `https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories`,
                        {
                            headers: {
                                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            },
                        }
                    ),
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

    return (
            <div className="container">
                <div className="recipe-detail-content">
                    <div className="recipe-detail-header">
                        <h1>{recipe.title}</h1>
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
                                    // src="https://images.unsplash.com/photo-1603133872878-684f208fb84b"
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                            </div>

                            <section className="recipe-info-card">
                                <div className="recipe-info-item">
                                    <span className="recipe-info-label">Totale tijd</span>
                                    <strong>{totalTime} minuten</strong>
                                </div>

                                <div className="recipe-info-item">
                                    <span className="recipe-info-label">Porties</span>
                                    <strong>{recipe.servings}</strong>
                                </div>

                                <div className="recipe-info-item">
                                    <span className="recipe-info-label">Moeilijkheid</span>
                                    <strong>{recipe.difficulty}</strong>
                                </div>
                            </section>

                            <section className="recipe-detail-card">
                                <h3>Bereidingswijze</h3>
                                <p className="recipe-detail-card-subtitle">Zo maak je het</p>

                                <div className="recipe-steps">
                                    {makeInstructionsReadable(recipe.instructions).map((step, index) => (
                                        <p key={index} className="recipe-info-label">
                                            {step}.
                                        </p>
                                    ))}
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
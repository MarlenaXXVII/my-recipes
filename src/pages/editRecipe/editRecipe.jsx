import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import RecipeForm from "../../components/RecipeForm.jsx";
import getRecipeIngredients from "../../helpers/getRecipeIngredients.js";
import getRecipeCategories from "../../helpers/getRecipeCategories.js";

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        async function fetchRecipeData() {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const decoded = jwtDecode(token);
                const currentUserId = Number(decoded.userId);
                const isAdmin = decoded.role === 'admin';

                const headers = {
                    'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                };

                const [
                    recipeResponse,
                    recipeIngredientsResponse,
                    ingredientsResponse,
                    recipeCategoriesResponse,
                    categoriesResponse
                ] = await Promise.all([
                    axios.get(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes/${id}`, { headers }),
                    axios.get(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients`, { headers }),
                    axios.get(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients`, { headers }),
                    axios.get(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories`, { headers }),
                    axios.get(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories`, { headers }),
                ]);

                const recipe = recipeResponse.data;
                const isOwner = Number(recipe.ownerProfileId) === currentUserId;

                if (!isOwner && !isAdmin) {
                    navigate(`/recept/${id}`);
                    return;
                }

                const recipeIngredients = getRecipeIngredients(
                    recipeIngredientsResponse.data,
                    ingredientsResponse.data,
                    id
                );

                const recipeCategories = getRecipeCategories(
                    recipeCategoriesResponse.data,
                    categoriesResponse.data,
                    id
                );

                setInitialValues({
                    id: recipe.id,
                    ownerProfileId: recipe.ownerProfileId,
                    title: recipe.title || '',
                    description: recipe.description || '',
                    image: recipe.image || '',
                    servings: recipe.servings || '',
                    prepTimeMinutes: recipe.prepTimeMinutes || '',
                    cookTimeMinutes: recipe.cookTimeMinutes || '',
                    difficulty: recipe.difficulty || '',
                    calories: recipe.calories || '',
                    protein: recipe.protein || '',
                    carbs: recipe.carbs || '',
                    fat: recipe.fat || '',
                    instructions: recipe.instructions || '',
                    selectedCategoryIds: recipeCategories.map((category) => category.categoryId),
                    ingredients: recipeIngredients.map((ingredient) => ({
                        name: ingredient.name || '',
                        amount: ingredient.amount || '',
                        unit: ingredient.unit || '',
                        notes: ingredient.notes || '',
                    })),
                });
            } catch (error) {
                console.error(error);
                navigate(`/recept/${id}`);
            }
        }

        fetchRecipeData();
    }, [id, navigate]);

    async function handleEditRecipe({ form, ingredients, selectedCategoryIds, allIngredients }) {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const decoded = jwtDecode(token);
        const currentUserId = Number(decoded.userId);
        const isAdmin = decoded.role === 'admin';

        if (!isAdmin && currentUserId !== Number(initialValues.ownerProfileId)) {
            navigate(`/recept/${id}`);
            return;
        }

        const headers = {
            headers: {
                Authorization: `Bearer ${token}`,
                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
            },
        };

        const updatedRecipeData = {
            id: Number(id),
            ownerProfileId: Number(decoded.userId),
            title: form.title.value,
            description: form.description.value,
            instructions: form.instructions.value,
            image: initialValues.image || null,
            servings: Number(form.servings.value),
            prepTimeMinutes: Number(form.prepTimeMinutes.value),
            cookTimeMinutes: Number(form.cookTimeMinutes.value),
            difficulty: form.difficulty.value,
            calories: Number(form.calories.value),
            protein: Number(form.protein.value),
            carbs: Number(form.carbs.value),
            fat: Number(form.fat.value),
        };

        try {
            await axios.put(
                `https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes/${id}`,
                updatedRecipeData,
                headers
            );

            const [recipeIngredientsResponse, recipeCategoriesResponse] = await Promise.all([
                axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients', headers),
                axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories', headers),
            ]);

            const currentIngredientLinks = recipeIngredientsResponse.data.filter(
                (item) => Number(item.recipeId) === Number(id)
            );

            const currentCategoryLinks = recipeCategoriesResponse.data.filter(
                (item) => Number(item.recipeId) === Number(id)
            );

            await Promise.all([
                ...currentIngredientLinks.map((item) =>
                    axios.delete(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients/${item.id}`, headers)
                ),
                ...currentCategoryLinks.map((item) =>
                    axios.delete(`https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories/${item.id}`, headers)
                ),
            ]);

            await Promise.all(
                selectedCategoryIds.map((categoryId) =>
                    axios.post(
                        'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories', {recipeId: Number(id), categoryId,}, headers
                    )
                )
            );

            const filledIngredients = ingredients.filter(
                (ingredient) =>
                    ingredient.name.trim() !== '' &&
                    ingredient.amount !== '' &&
                    ingredient.unit.trim() !== ''
            );

            for (const ingredient of filledIngredients) {
                let ingredientId;

                const existingIngredient = allIngredients.find(
                    (item) => item.name.toLowerCase() === ingredient.name.trim().toLowerCase()
                );

                if (existingIngredient) {
                    ingredientId = existingIngredient.id;
                } else {
                    const newIngredientResponse = await axios.post(
                        'https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients', {name: ingredient.name.trim(),}, headers
                    );

                    ingredientId = newIngredientResponse.data.id;
                }

                await axios.post(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients',
                    {
                        recipeId: Number(id),
                        ingredientId,
                        amount: Number(ingredient.amount),
                        unit: ingredient.unit.trim(),
                        notes: ingredient.notes.trim() || null,
                    }, headers
                );
            }

            navigate(`/recept/${id}`);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    if (!initialValues) {
        return <p>Recept laden...</p>;
    }

    return (
        <RecipeForm
            initialValues={initialValues}
            onSave={handleEditRecipe}
            buttonText="Sla recept op"
            title="Wijzig recept"
            cancelPath={`/recept/${id}`}
        />
    );
}

export default EditRecipe;
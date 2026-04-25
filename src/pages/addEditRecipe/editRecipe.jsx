import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import RecipeForm from "../../components/RecipeForm.jsx";
import getRecipeIngredients from "../../helpers/getRecipeIngredients.js";
import getRecipeCategories from "../../helpers/getRecipeCategories.js";
import api from "../../helpers/api";

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

                const [
                    recipeResponse,
                    recipeIngredientsResponse,
                    ingredientsResponse,
                    recipeCategoriesResponse,
                    categoriesResponse
                ] = await Promise.all([
                    api.get(`/api/recipes/${id}`),
                    api.get("/api/recipe_ingredients"),
                    api.get("/api/ingredients"),
                    api.get("/api/recipe_categories"),
                    api.get("/api/categories"),
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
        const imageFile = form.image?.files?.[0];

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
            servings: Number(form.servings.value),
            prepTimeMinutes: Number(form.prepTimeMinutes.value),
            cookTimeMinutes: Number(form.cookTimeMinutes.value),
            difficulty: form.difficulty.value,
            calories: form.calories.value ? Number(form.calories.value) : null,
            protein: form.protein.value ? Number(form.protein.value) : null,
            carbs: form.carbs.value ? Number(form.carbs.value) : null,
            fat: form.fat.value ? Number(form.fat.value) : null,
        };

        try {
            await api.put(`/api/recipes/${id}`,
                updatedRecipeData,
                headers
            );

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                await api.patch(`/api/recipes/${id}`,
                    imageFormData,
                    headers
                );
            }

            const [recipeIngredientsResponse, recipeCategoriesResponse] = await Promise.all([
                api.get("/api/recipe_ingredients", headers),
                api.get("/api/recipe_categories", headers),

            ]);

            const currentIngredientLinks = recipeIngredientsResponse.data.filter(
                (item) => Number(item.recipeId) === Number(id)
            );

            const currentCategoryLinks = recipeCategoriesResponse.data.filter(
                (item) => Number(item.recipeId) === Number(id)
            );

            await Promise.all([
                ...currentIngredientLinks.map((item) =>
                    api.delete(`/api/recipe_ingredients/${item.id}`, headers)
                ),
                ...currentCategoryLinks.map((item) =>
                    api.delete(`/api/recipe_categories/${item.id}`, headers)
                ),
            ]);

            await
                selectedCategoryIds.map((categoryId) =>
                    api.post("/api/recipe_categories", {recipeId: Number(id), categoryId,}, headers)
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
                    const newIngredientResponse = await api.post("/api/ingredients", {name: ingredient.name.trim(),}, headers);
                    ingredientId = newIngredientResponse.data.id;
                }

                await api.post("/api/recipe_ingredients",
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
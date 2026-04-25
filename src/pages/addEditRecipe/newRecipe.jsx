import './newRecipe.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import api from "../../helpers/api.js";
import RecipeForm from "../../components/RecipeForm.jsx";


function NewRecipe() {
    const navigate = useNavigate();

    async function handleCreateRecipe({ form, ingredients, selectedCategoryIds, allIngredients }) {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const authHeader = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const decoded = jwtDecode(token);
        const imageFile = form.image?.files?.[0];

        const recipeData = {
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
            ownerProfileId: Number(decoded.userId),
        };

        try {
            const recipeResponse = await api.post(
                "/api/recipes",
                recipeData,
                authHeader
            );

            const recipeId = recipeResponse.data.id;

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                await api.patch(
                    `/api/recipes/${recipeId}`,
                    imageFormData,
                    authHeader
                );
            }

            await Promise.all(
                selectedCategoryIds.map((categoryId) =>
                    api.post(
                        "/api/recipe_categories",
                        {
                            recipeId,
                            categoryId,
                        },
                        authHeader
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
                    const newIngredientResponse = await api.post(
                        "/api/ingredients",
                        {
                            name: ingredient.name.trim(),
                        },
                        authHeader
                    );

                    ingredientId = newIngredientResponse.data.id;
                }

                await api.post(
                    "/api/recipe_ingredients",
                    {
                        recipeId,
                        ingredientId,
                        amount: Number(ingredient.amount),
                        unit: ingredient.unit.trim(),
                        notes: ingredient.notes.trim() || null,
                    },
                    authHeader
                );
            }

            navigate('/mijn-recepten');
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    const emptyRecipe = {
        title: '',
        description: '',
        servings: '',
        prepTimeMinutes: '',
        cookTimeMinutes: '',
        difficulty: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        instructions: '',
        selectedCategoryIds: [],
        ingredients: [{ name: '', amount: '', unit: '', notes: '' }],
    };

    return (
        <RecipeForm
            initialValues={emptyRecipe}
            onSave={handleCreateRecipe}
            buttonText="Maak recept aan"
            title="Nieuw recept"
            cancelPath="/"
        />
    );
}

export default NewRecipe;
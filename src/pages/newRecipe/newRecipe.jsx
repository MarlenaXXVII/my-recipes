import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import './newRecipe.css';

function NewRecipe() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);

    const [ingredients, setIngredients] = useState([
        { name: '', amount: '', unit: '', notes: '' }
    ]);

    useEffect(() => {
        async function fetchFormOptions() {
            try {
                const [categoriesResponse, ingredientsResponse] = await Promise.all([
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories', {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }),
                    axios.get('https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients', {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }),
                ]);

                setAllCategories(categoriesResponse.data);
                setAllIngredients(ingredientsResponse.data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchFormOptions();
    }, []);

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', amount: '', unit: '', notes: '' }
        ]);
    };

    const removeIngredient = (index) => {
        const updatedIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(updatedIngredients);
    };

    function toggleCategory(categoryId) {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const decoded = jwtDecode(token);
        const form = e.target;

        const recipeData = {
            title: form.title.value,
            description: form.description.value,
            instructions: form.instructions.value,
            image: null,
            servings: Number(form.servings.value),
            prepTimeMinutes: Number(form.prepTimeMinutes.value),
            cookTimeMinutes: Number(form.cookTimeMinutes.value),
            difficulty: form.difficulty.value,
            calories: Number(form.calories.value),
            protein: Number(form.protein.value),
            carbs: Number(form.carbs.value),
            fat: Number(form.fat.value),
            ownerProfileId: Number(decoded.userId),
        };

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
            },
        };

        try {
            // 1. Recept aanmaken
            const recipeResponse = await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes',
                recipeData,
                config
            );

            const recipeId = recipeResponse.data.id;

            // 2. Categorieën koppelen
            await Promise.all(
                selectedCategoryIds.map((categoryId) =>
                    axios.post(
                        'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories',
                        {
                            recipeId,
                            categoryId,
                        },
                        config
                    )
                )
            );

            // 3. Ingrediënten verwerken
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
                        'https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients',
                        {
                            name: ingredient.name.trim(),
                        },
                        config
                    );

                    ingredientId = newIngredientResponse.data.id;
                }

                await axios.post(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients',
                    {
                        recipeId,
                        ingredientId,
                        amount: Number(ingredient.amount),
                        unit: ingredient.unit.trim(),
                        notes: ingredient.notes.trim() || null,
                    },
                    config
                );
            }

            navigate('/mijn-recepten');
        } catch (error) {
            console.error('Fout bij opslaan recept:', error.response?.data || error.message);
        }
    }

    return (
        <div className="inner-container">
            <form className="recipe-form" onSubmit={handleSubmit}>
                <h2>Nieuw recept</h2>

                <section className="formSection">
                    <h2>Basis informatie</h2>

                    <div className="form-group">
                        <label htmlFor="title">Titel *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Bijv. Spaghetti Bolognese"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortDescription">Beschrijving</label>
                        <textarea
                            id="shortDescription"
                            name="description"
                            placeholder="Korte beschrijving van het gerecht"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Afbeelding</label>
                        <label htmlFor="image" className="upload-box">
                            <span className="upload-icon">&uarr;</span>
                            <span>Klik om een afbeelding te uploaden</span>
                            <small>Max 5MB</small>
                        </label>
                        <input id="image" name="image" type="file" hidden />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="portionAmount">Porties *</label>
                            <input
                                id="portionAmount"
                                name="servings"
                                type="text"
                                placeholder="4"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prepTime">Voorbereiden (min)</label>
                            <input
                                id="prepTime"
                                name="prepTimeMinutes"
                                type="text"
                                placeholder="15"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cookTime">Bereiden (min)</label>
                            <input
                                id="cookTime"
                                name="cookTimeMinutes"
                                type="text"
                                placeholder="30"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Moeilijkheid</label>
                            <input
                                id="difficulty"
                                name="difficulty"
                                type="text"
                                placeholder="Beginner"
                            />
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Categorieën</h2>
                    <div className="categories">
                        {allCategories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`category ${selectedCategoryIds.includes(category.id) ? 'active' : ''}`}
                                onClick={() => toggleCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="formSection">
                    <div className="section-header">
                        <h2>Ingrediënten</h2>
                        <button
                            type="button"
                            className="add-ingredient-button"
                            onClick={addIngredient}
                        >
                            + Toevoegen
                        </button>
                    </div>

                    <div className="ingredients-list">
                        {ingredients.map((ingredient, index) => (
                            <div className="ingredient-row" key={index}>
                                <div className="form-group small-field">
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={ingredient.amount}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'amount', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group small-field">
                                    <input
                                        type="text"
                                        placeholder="Eenheid"
                                        value={ingredient.unit}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'unit', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group large-field">
                                    <input
                                        type="text"
                                        placeholder="Ingrediënt"
                                        value={ingredient.name}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'name', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group medium-field">
                                    <input
                                        type="text"
                                        placeholder="Bijv. 'In blokjes'"
                                        value={ingredient.notes}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'notes', e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="remove-ingredient-button"
                                    onClick={() => removeIngredient(index)}
                                    disabled={ingredients.length === 1}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="formSection">
                    <h2>Macro's per portie</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="calories">Calorieën (kcal)</label>
                            <input
                                id="calories"
                                name="calories"
                                type="text"
                                placeholder="520"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="protein">Eiwitten (g)</label>
                            <input
                                id="protein"
                                name="protein"
                                type="text"
                                placeholder="22"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="carbs">Koolhydraten (g)</label>
                            <input
                                id="carbs"
                                name="carbs"
                                type="text"
                                placeholder="58"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fat">Vetten (g)</label>
                            <input
                                id="fat"
                                name="fat"
                                type="text"
                                placeholder="21"
                            />
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Bereidingswijze</h2>
                    <div className="form-group">
                        <textarea
                            id="preparation"
                            name="instructions"
                            placeholder="Beschrijf stap voor stap hoe je het gerecht bereidt.."
                        ></textarea>
                    </div>
                </section>

                <div className="buttons">
                    <button type="button" className="secondaryButton">
                        Annuleren
                    </button>
                    <button type="submit" className="primaryButton">
                        Recept aanmaken
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewRecipe;
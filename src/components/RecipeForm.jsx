import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import CategoryTags from "../components/CategoryTags";
import api from "../helpers/api.js";

function RecipeForm({ initialValues, onSave, buttonText, title, cancelPath }) {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(
        initialValues.selectedCategoryIds || []
    );
    const [allIngredients, setAllIngredients] = useState([]);
    const [errors, setErrors] = useState({});
    const [ingredients, setIngredients] = useState(
        initialValues.ingredients?.length
            ? initialValues.ingredients
            : [{ name: '', amount: '', unit: '', notes: '' }]
    );
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        async function fetchFormOptions() {
            try {
                const [categoriesResponse, ingredientsResponse] = await Promise.all([
                    api.get("/api/categories"),
                    api.get("/api/ingredients"),
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

    function validateRecipeForm(form, ingredients) {
        const newErrors = {};
        const description = form.description.value.trim();
        const imageFile = form.image?.files?.[0];

        if (!form.title.value.trim()) {
            newErrors.title = 'Titel is verplicht';
        }

        if (!description) {
            newErrors.description = 'Beschrijving is verplicht';
        } else if (description.length < 10) {
            newErrors.description = 'Beschrijving moet minimaal 10 tekens bevatten';
        } else if (description.length > 200) {
            newErrors.description = 'Beschrijving mag maximaal 200 tekens bevatten';
        }

        if (!form.servings.value.trim()) {
            newErrors.servings = 'Porties is verplicht';
        }

        if (!form.prepTimeMinutes.value.trim()) {
            newErrors.prepTimeMinutes = 'Voorbereidingstijd is verplicht';
        }

        if (!form.cookTimeMinutes.value.trim()) {
            newErrors.cookTimeMinutes = 'Bereidingstijd is verplicht';
        }

        if (!form.difficulty.value.trim()) {
            newErrors.difficulty = 'Moeilijkheid is verplicht';
        }

        if (!form.instructions.value.trim()) {
            newErrors.instructions = 'Bereidingswijze is verplicht';
        }

        if (imageFile) {
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/svg+xml',
            ];

            if (!allowedTypes.includes(imageFile.type)) {
                newErrors.image = 'Alleen jpg, png, gif, webp en svg zijn toegestaan';
            }

            if (imageFile.size > 2097152) {
                newErrors.image = 'Afbeelding mag maximaal 2MB zijn';
            }
        }

        const filledIngredients = ingredients.filter(
            (ingredient) =>
                ingredient.name.trim() !== '' &&
                ingredient.amount !== '' &&
                ingredient.unit.trim() !== ''
        );

        if (filledIngredients.length === 0) {
            newErrors.ingredients = 'Voeg minimaal 1 ingrediënt toe';
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const validationErrors = validateRecipeForm(form, ingredients);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        await onSave({
            form,
            ingredients,
            selectedCategoryIds,
            allIngredients,
        });
    }

    return (
        <div className="inner-container">
            <form className="recipe-form" onSubmit={handleSubmit}>
                <h2>{title}</h2>

                <section className="formSection">
                    <h2>Basis informatie</h2>

                    <div className="form-group">
                        <label htmlFor="title">Titel *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Bijv. Spaghetti Bolognese"
                            defaultValue={initialValues.title || ''}
                        />
                        {errors.title && <p className="field-error">{errors.title}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortDescription">Beschrijving *</label>
                        <textarea
                            id="shortDescription"
                            name="description"
                            placeholder="Korte beschrijving van het gerecht"
                            defaultValue={initialValues.description || ''}
                        ></textarea>
                        {errors.description && <p className="field-error">{errors.description}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Afbeelding</label>
                        <label htmlFor="image" className="upload-box">
                            <span className="upload-icon">&uarr;</span>
                            <span>{selectedFile ? selectedFile.name : "Klik om een afbeelding te uploaden"}</span>
                            <small>Max 2MB</small>
                        </label>
                        <input id="image" name="image" type="file" hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                setSelectedFile(file || null);
                            }}
                        />
                        {errors.image && <p className="field-error">{errors.image}</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="portionAmount">Porties *</label>
                            <input
                                id="portionAmount"
                                name="servings"
                                type="number"
                                placeholder="4"
                                defaultValue={initialValues.servings || ''}
                            />
                            {errors.servings && <p className="field-error">{errors.servings}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="prepTime">Voorbereiden (min) *</label>
                            <input
                                id="prepTime"
                                name="prepTimeMinutes"
                                type="number"
                                placeholder="15"
                                defaultValue={initialValues.prepTimeMinutes || ''}
                            />
                            {errors.prepTimeMinutes && <p className="field-error">{errors.prepTimeMinutes}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cookTime">Bereiden (min) *</label>
                            <input
                                id="cookTime"
                                name="cookTimeMinutes"
                                type="number"
                                placeholder="30"
                                defaultValue={initialValues.cookTimeMinutes || ''}
                            />
                            {errors.cookTimeMinutes && <p className="field-error">{errors.cookTimeMinutes}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Moeilijkheid *</label>
                            <input
                                id="difficulty"
                                name="difficulty"
                                type="text"
                                placeholder="Beginner"
                                defaultValue={initialValues.difficulty || ''}
                            />
                            {errors.difficulty && <p className="field-error">{errors.difficulty}</p>}
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Categorieën</h2>
                    <div className="categories">
                        <CategoryTags
                            categories={allCategories}
                            selectedCategories={selectedCategoryIds}
                            onToggleCategory={toggleCategory}
                        />
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
                        {errors.ingredients && <p className="field-error">{errors.ingredients}</p>}
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
                                type="number"
                                placeholder="520"
                                defaultValue={initialValues.calories || ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="protein">Eiwitten (g)</label>
                            <input
                                id="protein"
                                name="protein"
                                type="number"
                                placeholder="22"
                                defaultValue={initialValues.protein || ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="carbs">Koolhydraten (g)</label>
                            <input
                                id="carbs"
                                name="carbs"
                                type="number"
                                placeholder="58"
                                defaultValue={initialValues.carbs || ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fat">Vetten (g)</label>
                            <input
                                id="fat"
                                name="fat"
                                type="number"
                                placeholder="21"
                                defaultValue={initialValues.fat || ''}
                            />
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Bereidingswijze *</h2>
                    <div className="form-group">
                        <textarea
                            id="preparation"
                            name="instructions"
                            placeholder="Beschrijf stap voor stap hoe je het gerecht bereidt.."
                            defaultValue={initialValues.instructions || ''}
                        ></textarea>
                        {errors.instructions && <p className="field-error">{errors.instructions}</p>}
                    </div>
                </section>

                <div className="buttons">
                    <NavLink to={cancelPath} className="secondaryButton">
                        Annuleren
                    </NavLink>
                    <button type="submit" className="primaryButton">
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RecipeForm;
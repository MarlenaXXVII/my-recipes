import './weekMenu.css';
import RecipeModal from '../../components/RecipeModal.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import appLogoOnly from "../../assets/appLogoOnly.svg";

function WeekMenuPage() {
    const [weekmenuItems, setWeekmenuItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [categories, setCategories] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded?.userId;

    const modalTags = categories.map((category) => category.name);

    function getMondayFromDate(date) {
        const currentDate = new Date(date);
        const day = currentDate.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + diff);

        return currentDate;
    }

    function changeDateToString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function getDayNameInDutch(date) {
        return new Intl.DateTimeFormat('nl-NL', {
            weekday: 'long',
        }).format(date);
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function showWeekDates(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        const startMonth = new Intl.DateTimeFormat('nl-NL', {
            month: 'short',
        }).format(startDate).replace('.', '');

        const endMonth = new Intl.DateTimeFormat('nl-NL', {
            month: 'short',
        }).format(endDate).replace('.', '');

        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }

    const today = new Date();
    const currentWeekStart = getMondayFromDate(today);

    const visibleWeekStart = new Date(currentWeekStart);
    visibleWeekStart.setDate(currentWeekStart.getDate() + weekOffset * 7);

    const weekDaysConfig = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(visibleWeekStart);
        date.setDate(visibleWeekStart.getDate() + index);

        return {
            day: capitalize(getDayNameInDutch(date)),
            date: changeDateToString(date),
        };
    });

    const weekRange = showWeekDates(visibleWeekStart);

    async function fetchWeekmenuData() {
        if (!userId || !token) {
            setLoading(false);
            return;
        }

        try {
            const [
                weekmenuResponse,
                recipesResponse,
                categoriesResponse,
                recipeCategoriesResponse,
                ingredientsResponse,
                recipeIngredientsResponse,
            ] = await Promise.all([
                axios.get(
                    `https://novi-backend-api-wgsgz.ondigitalocean.app/api/profiles/${userId}/weekmenu_items`,
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
                axios.get(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes',
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }
                ),
                axios.get(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/categories',
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }
                ),
                axios.get(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_categories',
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }
                ),
                axios.get(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/ingredients',
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }
                ),
                axios.get(
                    'https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipe_ingredients',
                    {
                        headers: {
                            'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        },
                    }
                ),
            ]);

            setWeekmenuItems(weekmenuResponse.data);
            setRecipes(recipesResponse.data);
            setCategories(categoriesResponse.data);
            setRecipeCategories(recipeCategoriesResponse.data);
            setIngredients(ingredientsResponse.data);
            setRecipeIngredients(recipeIngredientsResponse.data);
        } catch (error) {
            console.error('Fout bij ophalen van weekmenu data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWeekmenuData();
    }, []);

    const weekDays = weekDaysConfig.map((dayConfig) => {
        const mealsForDay = weekmenuItems
            .filter((item) => {
                return (
                    Number(item.profileId) === Number(userId) &&
                    item.date === dayConfig.date
                );
            })
            .map((item) => {
                const matchingRecipe = recipes.find(
                    (recipe) => Number(recipe.id) === Number(item.recipeId)
                );

                if (!matchingRecipe) return null;

                return {
                    id: item.id,
                    recipeId: matchingRecipe.id,
                    title: matchingRecipe.title,
                    description: matchingRecipe.description,
                    image: matchingRecipe.image,
                    servings: matchingRecipe.servings,
                    time:
                        Number(matchingRecipe.prepTimeMinutes || 0) +
                        Number(matchingRecipe.cookTimeMinutes || 0),
                    calories: matchingRecipe.calories,
                    date: item.date,
                };
            })
            .filter(Boolean);

        const totalCalories = mealsForDay.reduce((total, meal) => {
            return total + Number(meal.calories || 0);
        }, 0);

        return {
            day: dayConfig.day,
            date: dayConfig.date,
            calories: mealsForDay.length > 0 ? totalCalories : null,
            meals: mealsForDay,
        };
    });

    const totalMeals = weekDays.reduce((total, day) => total + day.meals.length, 0);

    const filteredRecipes = recipes.filter((recipe) => {
        const title = recipe.title?.toLowerCase() || '';
        const description = recipe.description?.toLowerCase() || '';
        const searchValue = searchTerm.toLowerCase();

        const matchesSearch =
            title.includes(searchValue) || description.includes(searchValue);

        const categoryLinksForRecipe = recipeCategories.filter(
            (item) => Number(item.recipeId) === Number(recipe.id)
        );

        const categoryNamesForRecipe = categoryLinksForRecipe
            .map((item) => {
                const matchingCategory = categories.find(
                    (category) => Number(category.id) === Number(item.categoryId)
                );

                return matchingCategory ? matchingCategory.name.toLowerCase() : null;
            })
            .filter(Boolean);

        const matchesTag =
            selectedTag === '' ||
            categoryNamesForRecipe.includes(selectedTag.toLowerCase());

        return matchesSearch && matchesTag;
    });

    function handleOpenModal(day, date) {
        setErrors({});
        setSelectedDay(day);
        setSelectedDate(date);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setErrors({});
        setIsModalOpen(false);
        setSelectedDay(null);
        setSelectedDate(null);
        setSearchTerm('');
        setSelectedTag('');
    }

    function isRecipeAlreadyAddedToDay(recipeId, date) {
        return weekmenuItems.some(
            (item) =>
                Number(item.profileId) === Number(userId) &&
                item.date === date &&
                Number(item.recipeId) === Number(recipeId)
        );
    }

    async function handleAddRecipeToWeekmenu(recipeId) {
        if (!selectedDay || !selectedDate) return;

        setErrors({});

        const recipeAlreadyExists = isRecipeAlreadyAddedToDay(recipeId, selectedDate);

        if (recipeAlreadyExists) {
            setErrors({
                duplicateRecipe: 'Dit gerecht is al toegevoegd aan deze dag',
            });
            return;
        }

        try {
            setIsSaving(true);

            await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/weekmenu_items',
                {
                    profileId: userId,
                    recipeId: recipeId,
                    day: selectedDay,
                    date: selectedDate,
                },
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchWeekmenuData();
            handleCloseModal();
        } catch (error) {
            console.error('Fout bij toevoegen van recept aan weekmenu:', error);
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="weekmenu-page">
                <div className="container">
                    <p>Weekmenu laden...</p>
                </div>
            </main>
        );
    }
    function normalizeText(text) {
        return text.trim().toLowerCase();
    }

    function generateShoppingListForCurrentWeek(weekDays, recipeIngredients, ingredients) {
        const ingredientMap = {};

        for (const day of weekDays) {
            for (const meal of day.meals) {
                const recipeIngredientRows = recipeIngredients.filter(
                    (row) => Number(row.recipeId) === Number(meal.recipeId)
                );

                for (const row of recipeIngredientRows) {
                    const ingredient = ingredients.find(
                        (item) => Number(item.id) === Number(row.ingredientId)
                    );

                    if (!ingredient) continue;

                    const ingredientName = ingredient.name;
                    const normalizedName = normalizeText(ingredientName);
                    const unit = row.unit || '';
                    const key = `${normalizedName}-${unit}`;

                    if (!ingredientMap[key]) {
                        ingredientMap[key] = {
                            name: ingredientName,
                            amount: Number(row.amount) || 0,
                            unit: unit,
                            notes: row.notes || '',
                        };
                    } else {
                        ingredientMap[key].amount += Number(row.amount) || 0;
                    }
                }
            }
        }

        return Object.values(ingredientMap).sort((a, b) =>
            a.name.localeCompare(b.name, 'nl-NL')
        );
    }
    function handleGenerateShoppingList() {
        setErrors({});

        if (totalMeals === 0) {
            setErrors({
                emptyWeek: 'Het weekmenu is nog leeg, voeg een recept toe om een boodschappenlijst te maken',
            });
            return;
        }

        const generatedList = generateShoppingListForCurrentWeek(
            weekDays,
            recipeIngredients,
            ingredients
        );

        navigate('/boodschappenlijst', {
            state: {
                shoppingList: generatedList,
                weekRange: weekRange,
            },
        });
    }

    const BASE_URL = 'https://novi-backend-api-wgsgz.ondigitalocean.app';

    return (
        <main className="weekmenu-page">
            <div className="container">
                <div className="weekmenu-topbar">
                    <h1>Weekmenu</h1>
                    {errors.emptyWeek && (<p className="field-error">{errors.emptyWeek}</p>)}

                    <button className="primaryButton" type="button" onClick={handleGenerateShoppingList}>
                        <span>Maak boodschappenlijst</span>
                    </button>
                </div>

                <section className="week-selector">
                    <button
                        className="week-selector-arrow"
                        type="button"
                        aria-label="Vorige week"
                        onClick={() => setWeekOffset((prev) => prev - 1)}
                    >
                        <ChevronLeft />
                    </button>

                    <div className="week-selector-info">
                        <h2>{weekRange}</h2>
                        <p>{totalMeals} maaltijden gepland</p>
                    </div>

                    <button
                        className="week-selector-arrow"
                        type="button"
                        aria-label="Volgende week"
                        onClick={() => setWeekOffset((prev) => prev + 1)}
                    >
                        <ChevronRight />
                    </button>
                </section>

                <section className="weekmenu-grid">
                    {weekDays.map((day) => (
                        <article className="day-column" key={day.date}>
                            <div className="day-column-header">
                                <h3>{day.day}</h3>
                                <span>
                                    {day.calories ? `${day.calories} kcal` : '\u00A0'}
                                </span>
                            </div>

                            <div className="day-column-body">
                                {day.meals.length === 0 ? (
                                    <div className="empty-day">
                                        <p>Nog geen maaltijden</p>
                                    </div>
                                ) : (
                                    day.meals.map((meal) => {
                                        const imageSrc = meal.image
                                            ? meal.image.base64
                                                ? `data:${meal.image.contentType};base64,${meal.image.base64}`
                                                : `${BASE_URL}${meal.image}`
                                            : appLogoOnly;

                                        return (
                                            <div className="weekmenu-recipe-card" key={meal.id}>
                                                <img
                                                    src={imageSrc}
                                                    alt={meal.title}
                                                    className="weekmenu-recipe-card-image"
                                                    onError={(e) => {
                                                        e.currentTarget.src = appLogoOnly;
                                                    }}
                                                />

                                                <div className="weekmenu-recipe-card-content">
                                                    <span>{meal.servings} porties</span>
                                                    <span>{meal.time} min</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="day-column-footer">
                                <button
                                    className="add-meal-button"
                                    type="button"
                                    onClick={() => handleOpenModal(day.day, day.date)}
                                >
                                    <span>Maaltijd toevoegen</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </div>

            {isModalOpen && (
                <RecipeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    modalTags={modalTags}
                    filteredRecipes={filteredRecipes}
                    onAddRecipe={handleAddRecipeToWeekmenu}
                    isSaving={isSaving}
                    error={errors.duplicateRecipe}
                />
            )}
        </main>
    );
}

export default WeekMenuPage;
import './recipeOverview.css';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import RecipeList from "../../components/RecipeList";
import SearchBar from "../../components/SearchBar";
import CategoryTags from "../../components/CategoryTags.jsx";
import api from "../../helpers/api";

function AllRecipe({ onlyMine = false }) {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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

    if (searchTerm.trim() !== "") {
        filteredRecipes = filteredRecipes.filter((recipe) => {
            const title = recipe.title?.toLowerCase() || "";
            const description = recipe.description?.toLowerCase() || "";
            const searchValue = searchTerm.toLowerCase();

            return title.includes(searchValue) || description.includes(searchValue);
        });
    }

    if (selectedCategory !== "all") {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            recipeCategoryMap[recipe.id]?.includes(selectedCategory)
        );
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const [recipesResponse, categoriesResponse, recipeCategoriesResponse] = await Promise.all([
                    api.get("/api/recipes"),
                    api.get("/api/categories"),
                    api.get("/api/recipe_categories"),
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
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>

                    <div className="filter-tags">
                        <CategoryTags
                            categories={categories}
                            selectedCategories={selectedCategory}
                            onToggleCategory={setSelectedCategory}
                            showAll={true}
                            onSelectAll={() => setSelectedCategory("all")}
                        />
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
                        <RecipeList
                            recipes={filteredRecipes}
                            recipeCategoryMap={recipeCategoryMap}
                            categoryMap={categoryMap}
                        />

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
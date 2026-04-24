import RecipeCard from "./RecipeCard";

function RecipeList({ recipes, recipeCategoryMap, categoryMap }) {
    return (
        <div className="recipe-grid">
            {recipes.map((recipe) => {
                const firstCategoryId = recipeCategoryMap[recipe.id]?.[0];
                const categoryName = categoryMap[firstCategoryId];

                return (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        categoryName={categoryName}
                    />
                );
            })}
        </div>
    );
}

export default RecipeList;
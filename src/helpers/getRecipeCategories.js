function getRecipeCategories(recipeCategories, categories, recipeId) {
    return recipeCategories
        .filter((item) => item.recipeId === Number(recipeId))
        .map((item) => {
            const matchingCategory = categories.find(
                (category) => category.id === item.categoryId
            );

            return {
                recipeCategoryId: item.id,
                categoryId: item.categoryId,
                name: matchingCategory ? matchingCategory.name : 'Onbekende categorie',
            };
        });
}

export default getRecipeCategories;
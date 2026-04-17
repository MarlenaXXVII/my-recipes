function getRecipeIngredients(recipeIngredients, ingredients, recipeId) {
    return recipeIngredients
        .filter((item) => item.recipeId === Number(recipeId))
        .map((item) => {
            const matchingIngredient = ingredients.find(
                (ingredient) => ingredient.id === item.ingredientId
            );

            return {
                id: item.id,
                name: matchingIngredient ? matchingIngredient.name : '',
                amount: item.amount,
                unit: item.unit,
                notes: item.notes,
            };
        });
}
export default getRecipeIngredients;
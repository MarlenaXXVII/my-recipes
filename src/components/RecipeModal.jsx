function RecipeModal({
                         isOpen,
                         onClose,
                         searchTerm,
                         setSearchTerm,
                         selectedTag,
                         setSelectedTag,
                         modalTags,
                         filteredRecipes,
                         onAddRecipe,
                         isSaving,
                     }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
                <div className="recipe-modal-header">
                    <div>
                        <h2>Recept toevoegen</h2>
                        <p>Kies een recept voor deze maaltijd</p>
                    </div>

                    <button
                        type="button"
                        className="recipe-modal-close-button"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="recipe-modal-content">
                    <div className="recipe-modal-search">
                        <input
                            type="text"
                            placeholder="Zoek recepten..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="recipe-modal-tags">
                        {modalTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                className={`recipe-tag-filter ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() =>
                                    setSelectedTag((prev) => (prev === tag ? '' : tag))
                                }
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="recipe-modal-grid">
                        {filteredRecipes.length === 0 ? (
                            <p>Geen recepten gevonden.</p>
                        ) : (
                            filteredRecipes.map((recipe) => {
                                const totalTime =
                                    Number(recipe.prepTimeMinutes || 0) +
                                    Number(recipe.cookTimeMinutes || 0);

                                return (
                                    <button
                                        key={recipe.id}
                                        type="button"
                                        className="recipe-select-card"
                                        onClick={() => onAddRecipe(recipe.id)}
                                        disabled={isSaving}
                                    >
                                        <div className="recipe-select-card-image-wrapper">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.title}
                                                className="recipe-select-card-image"
                                            />
                                        </div>

                                        <div className="recipe-select-card-content">
                                            <h3>{recipe.title}</h3>
                                            <p>{recipe.description}</p>

                                            <div className="recipe-select-card-footer">
                                                <span>{totalTime} min</span>
                                                <span>{recipe.servings}</span>
                                                <span>{recipe.calories || 0} kcal</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeModal;
import { Clock, Users, Flame, Search, X } from 'lucide-react';
import appLogoOnly from '../assets/appLogoOnly.svg';
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
                         error,
                     }) {
    if (!isOpen) return null;
    const BASE_URL = 'https://novi-backend-api-wgsgz.ondigitalocean.app';
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
                <div className="recipe-modal-header">
                    <div>
                        <h2>Recept toevoegen</h2>
                        <p>Kies een recept voor deze maaltijd</p>
                        {error && <p className="field-error">{error}</p>}
                    </div>
                    <button
                        type="button"
                        className="recipe-modal-close-button"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
                <div className="recipe-modal-content">
                    <div className="recipe-modal-search">
                        <Search />
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
                                const imageSrc = recipe.image
                                    ? recipe.image.base64
                                        ? `data:${recipe.image.contentType};base64,${recipe.image.base64}`
                                        : `${BASE_URL}${recipe.image}`
                                    : appLogoOnly;
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
                                                src={imageSrc}
                                                alt={recipe.title}
                                                className="recipe-select-card-image"
                                                onError={(e) => {
                                                    e.currentTarget.src = appLogoOnly;
                                                }}
                                            />
                                        </div>
                                        <div className="recipe-select-card-content">
                                            <h3>{recipe.title}</h3>
                                            <p>{recipe.description}</p>
                                            <div className="recipe-select-card-footer">
                                                <span><Clock />{totalTime} min</span>
                                                <span><Users />{recipe.servings}</span>
                                                <span><Flame />{recipe.calories || 0} kcal</span>
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
import { Link } from "react-router-dom";
import { Clock, Users, Flame } from "lucide-react";
import appLogoOnly from "../assets/appLogoOnly.svg";

const BASE_URL = "https://novi-backend-api-wgsgz.ondigitalocean.app";

function RecipeCard({ recipe, categoryName }) {
    const imageSrc = recipe.image
        ? recipe.image.base64
            ? `data:${recipe.image.contentType};base64,${recipe.image.base64}`
            : `${BASE_URL}${recipe.image}`
        : appLogoOnly;

    return (
        <article className="recipe-card">
            <Link to={`/recept/${recipe.id}`} className="recipe-card-link">
                <div className="recipe-card-image-wrapper">
                    <img
                        src={imageSrc}
                        alt={recipe.title}
                        className="recipe-card-image"
                    />

                    {categoryName && (
                        <span className="recipe-category-badge">
                            {categoryName}
                        </span>
                    )}
                </div>

                <div className="recipe-card-content">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>

                    <div className="recipe-meta">
                        <span><Clock /> {recipe.prepTimeMinutes} min</span>
                        <span><Users /> {recipe.servings} pers.</span>
                        <span><Flame /> {recipe.calories} kcal</span>
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default RecipeCard;
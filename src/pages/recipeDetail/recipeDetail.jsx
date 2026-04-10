import './recipeDetail.css';
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function RecipeDetail() {

    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchRecipe() {
            try {
                const response = await axios.get(
                    `https://novi-backend-api-wgsgz.ondigitalocean.app/api/recipes/${id}`,
                    {
                        headers: {
                            "novi-education-project-id": '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        }
                    }
                );

                console.log(response.data);
                setRecipe(response.data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchRecipe();
    }, [id]);

    return (
        <>
            <h1>Dit is id: {id}</h1>

            {recipe && (
                <>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                </>
            )}
        </>
    )
}

export default RecipeDetail;
import './newRecipe.css';

function NewRecipe() {
    //      TODO: UseState toevoegen voor de categorieen
    //      TODO: Afbeelding uploaden
    //      TODO: formulier versturen

    return (
        <>
            <div className="inner-container">

            <form className="recipe-form">
                <h2>Nieuw recept</h2>
                <section className="formSection">
                    <h2>Basis informatie</h2>

                    <div className="form-group">
                        <label htmlFor="title">Titel *</label>
                        <input id="title" type="text" placeholder="Bijv. Spaghetti Bolognese" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortDescription">Beschrijving</label>
                        <textarea id="shortDescription" placeholder="Korte beschrijving van het gerecht"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Afbeelding</label>
                        <label htmlFor="image" className="upload-box">
                            <span className="upload-icon">&uarr;</span>
                            <span>Klik om een afbeelding te uploaden</span>
                            <small>Max 5MB</small>
                        </label>
                        <input id="image" type="file" hidden />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="portionAmount">Porties *</label>
                            <input id="portionAmount" type="text" placeholder="4" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prepTime">Voorbereiden (min)</label>
                            <input id="prepTime" type="text" placeholder="15" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cookTime">Bereiden (min)</label>
                            <input id="cookTime" type="text" placeholder="30" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Moeilijkheid</label>
                            <input id="difficulty" type="text" placeholder="Beginner" />
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Categorieën</h2>
                    <div className="categories">
                        <button type="button" className="category">Ontbijt</button>
                        <button type="button" className="category">Lunch</button>
                        <button type="button" className="category">Diner</button>
                        <button type="button" className="category">Dessert</button>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Marco's per portie</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="calories">Calorieën (kcal)</label>
                            <input id="calories" type="text" placeholder="4" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="protein">Eiwitten (g)</label>
                            <input id="protein" type="text" placeholder="15" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="carbs">Koolhydraten (g)</label>
                            <input id="carbs" type="text" placeholder="30" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fat">Vetten (g)</label>
                            <input id="fat" type="text" placeholder="Beginner" />
                        </div>
                    </div>
                </section>

                <section className="formSection">
                    <h2>Bereidingswijze</h2>
                    <div className="form-group">
                        <textarea id="shortDescription" placeholder="Beschrijf stap voor stap hoe je het gerecht bereidt.."></textarea>
                    </div>
                </section>

                <div className="buttons">
                    <button type="button" className="secondaryButton">Annuleren</button>
                    <button type="submit" className="primaryButton">Recept aanmaken</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default NewRecipe;
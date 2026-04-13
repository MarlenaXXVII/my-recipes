import './weekMenu.css';

function WeekMenu() {

    const weekData = {
        range: '9 mrt - 15 mrt',
        mealsPlanned: 8,
        days: [
            {
                name: 'Maandag',
                kcal: 760,
                meals: [
                    {
                        id: 1,
                        image: '',
                        portions: 4,
                        time: 25,
                    },
                    {
                        id: 2,
                        image: '',
                        portions: 4,
                        time: 30,
                    },
                ],
            },
            {
                name: 'Dinsdag',
                kcal: null,
                meals: [],
            },
            {
                name: 'Woensdag',
                kcal: 520,
                meals: [
                    {
                        id: 3,
                        image: '',
                        portions: 4,
                        time: 30,
                    },
                ],
            },
            {
                name: 'Donderdag',
                kcal: 220,
                meals: [
                    {
                        id: 4,
                        image: '',
                        portions: 4,
                        time: 35,
                    },
                ],
            },
            {
                name: 'Vrijdag',
                kcal: 380,
                meals: [
                    {
                        id: 5,
                        image: '',
                        portions: 4,
                        time: 20,
                    },
                ],
            },
            {
                name: 'Zaterdag',
                kcal: 900,
                meals: [
                    {
                        id: 6,
                        image: '',
                        portions: 4,
                        time: 25,
                    },
                    {
                        id: 7,
                        image: '',
                        portions: 4,
                        time: 20,
                    },
                    {
                        id: 8,
                        image: '',
                        portions: 4,
                        time: 15,
                    },
                ],
            },
            {
                name: 'Zondag',
                kcal: null,
                meals: [],
            },
        ],
    };

    return (
        <>
            <div className="container">
                <div className="weekmenu-header">
                    <h1>Weekmenu</h1>

                    <button type="button" className="primaryButton">
                        <span>Maak boodschappenlijst</span>
                    </button>
                </div>

                <section className="week-switcher">
                    <button type="button" className="week-arrow">
                        ‹
                    </button>

                    <div className="week-switcher-info">
                        <h2>9 mrt - 15 mrt</h2>
                        <p>8 maaltijden gepland</p>
                    </div>

                    <button type="button" className="week-arrow">
                        ›
                    </button>
                </section>

                <section className="week-columns">
                    {weekData.days.map((day) => (
                        <article className="day-column" key={day.name}>
                            <div className="day-column-header">
                                <h3>{day.name}</h3>
                                <p>{day.kcal ? `${day.kcal} kcal` : '\u00A0'}</p>
                            </div>

                            <div className="day-column-body">
                                {day.meals.length > 0 ? (
                                    day.meals.map((meal) => (
                                        <div className="meal-card" key={meal.id}>
                                            <img
                                                src={meal.image}
                                                alt="Gerecht"
                                                className="meal-image"
                                            />

                                            <div className="meal-meta">
                                                <span>{meal.portions} porties</span>
                                                <span>{meal.time} min</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-day">
                                        <p>Nog geen maaltijden</p>
                                    </div>
                                )}
                            </div>

                            <div className="day-column-footer">
                                <button type="button" className="add-meal-button">
                                    <span>+</span>
                                    <span>Maaltijd toevoegen</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </>
    )
}
export default WeekMenu;
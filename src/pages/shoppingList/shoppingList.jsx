import './shoppingList.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ShoppingList() {
    // TODO: Add functionality to the download and share buttons
    // TODO: When reloading, keep the checked state

    const location = useLocation();
    const navigate = useNavigate();

    const initialShoppingList = location.state?.shoppingList || [];
    const weekRange = location.state?.weekRange || '';

    const [shoppingList, setShoppingList] = useState(
        initialShoppingList.map((item, index) => ({
            ...item,
            id: `${item.name}-${item.unit}-${index}`,
            checked: false,
        }))
    );

    function toggleItem(itemId) {
        setShoppingList((prevList) =>
            prevList.map((item) =>
                item.id === itemId
                    ? { ...item, checked: !item.checked }
                    : item
            )
        );
    }

    const checkedItemsCount = shoppingList.filter((item) => item.checked).length;
    const totalItemsCount = shoppingList.length;
    const progressPercentage =
        totalItemsCount > 0
            ? Math.round((checkedItemsCount / totalItemsCount) * 100)
            : 0;

    return (
            <div className="container">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate('/weekmenu')}
                >
                    ← Terug naar weekmenu
                </button>

                <div className="shopping-list-header">
                    <div>
                        <h1>Boodschappenlijst</h1>
                        <p>{weekRange}</p>
                    </div>
                </div>

                <section className="shopping-list-progress">
                    <div className="shopping-list-progress-text">
                        <span>
                            {checkedItemsCount} van {totalItemsCount} items afgevinkt
                        </span>
                        <span>{progressPercentage}%</span>
                    </div>

                    <div className="shopping-list-progress-bar">
                        <div
                            className="shopping-list-progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </section>

                <section className="shopping-list-card">
                    {shoppingList.length === 0 ? (
                        <p>Geen producten gevonden voor deze week.</p>
                    ) : (
                        shoppingList.map((item) => (
                            <label className="shopping-list-item" key={item.id}>
                                <div className="shopping-list-item-left">
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => toggleItem(item.id)}
                                    />
                                    <span
                                        className={
                                            item.checked ? 'checked-item-name' : ''
                                        }
                                    >
                                        {item.name}
                                    </span>
                                </div>

                                <span
                                    className={
                                        item.checked ? 'checked-item-amount' : ''
                                    }
                                >
                                    {item.amount} {item.unit}
                                </span>
                            </label>
                        ))
                    )}
                </section>
            </div>
    );
}

export default ShoppingList;
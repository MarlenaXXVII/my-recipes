import './shoppingList.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';

function ShoppingList() {
    // TODO: When reloading, keep the checked state
    const [message, setMessage] = useState('');

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

    function downloadShoppingList() {
        setMessage('');
        const uncheckedItems = shoppingList.filter((item) => !item.checked);

        if (uncheckedItems.length === 0) {
            setMessage('Alle ingrediënten zijn al afgevinkt.');
            return;
        }

        const content = [
            `Boodschappenlijst ${weekRange}`,
            '',
            ...uncheckedItems.map(
                (item) => `- ${item.name}: ${item.amount} ${item.unit}`
            ),
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'boodschappenlijst.txt';
        a.click();

        URL.revokeObjectURL(url);
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
                <ArrowLeft /> Terug naar weekmenu
            </button>

            <div className="shopping-list-header">
                <div className="header-left">
                    <h1>Boodschappenlijst</h1>
                    <p>{weekRange}</p>
                </div>

                <div className="header-right">
                    <button
                        type="button"
                        className="secondaryButton"
                        onClick={downloadShoppingList}
                    >
                        <Download size={18} />
                        Download
                    </button>
                </div>
            </div>
            {message && <p className="field-error">{message}</p>}


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
function CategoryTags({
                          categories,
                          selectedCategories,
                          onToggleCategory,
                          showAll = false,
                          onSelectAll,
                      }) {
    return (
        <div className="filter-tags">
            {showAll && (
                <button
                    type="button"
                    className={`filter-tag ${selectedCategories === "all" ? "active" : ""}`}
                    onClick={onSelectAll}
                >
                    Alle
                </button>
            )}

            {categories.map((category) => {
                const categoryId = category.id ?? category;
                const categoryName = category.name ?? category;

                const isActive = Array.isArray(selectedCategories)
                    ? selectedCategories.includes(categoryId)
                    : selectedCategories === categoryId;

                return (
                    <button
                        key={categoryId}
                        type="button"
                        className={`filter-tag ${isActive ? "active" : ""}`}
                        onClick={() => onToggleCategory(categoryId)}
                    >
                        {categoryName}
                    </button>
                );
            })}
        </div>
    );
}

export default CategoryTags;
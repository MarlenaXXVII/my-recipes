import { Search } from "lucide-react";

function SearchBar({ value, onChange, placeholder = "Zoek recepten..." }) {
    return (
        <div className="search-bar-wrapper">
            <Search />
            <input
                type="text"
                className="search-bar"
                placeholder="Zoek recepten..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;
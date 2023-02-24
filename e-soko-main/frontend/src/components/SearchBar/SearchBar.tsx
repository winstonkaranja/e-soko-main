import React from "react";
import "./SearchBar.scss";

interface SearchBarProps {
    query: string,
    setQuery: (event: string) => void,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SearchBar = ({ query, handleInputChange } : SearchBarProps) => {
        
    return ( 
        <div className="app__searchBar">
            <input type='text' value={query} onChange={handleInputChange} placeholder='Search product or category'/>
            <button>Search</button>
        </div>
    );
}
 
export default SearchBar;
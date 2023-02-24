import React, { useState, useEffect } from "react";
import { Images } from "../../constants";
import { useDebounce } from "use-debounce";

import SearchBar from "../SearchBar/SearchBar";
import * as ProductsApi from "../../network/products";
import "./Navbar.scss";
import { Product } from "../../models/product";

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);
    const [searchResults, setSearchResults] = useState<Product[]>();

    useEffect(() => {   
        async function perfomSearch () {
            const results = await ProductsApi.queryProducts(debouncedQuery);
            setSearchResults(results);
        }

        if(debouncedQuery){
            perfomSearch();
        }

        return () => {
            setSearchResults([]);
        }

    }, [debouncedQuery]);
    

    async function handleSearchInput (event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);

    }

    
    
    return ( 
        <nav className="app__navbar">
            <div className="app__navbar-logo">
                <img src={Images.logo} alt="logo"/>
                <h3>E-Soko</h3>
            </div>

            <div className="app__searchBar">
                <SearchBar 
                    query={query}
                    handleInputChange={handleSearchInput} setQuery={function (event: string): void {
                        throw new Error("Function not implemented.");
                    } }
                    />
            </div>
                
            <div className="app__navbar-links">
                <div>
                    <img src={Images.categoryIcon} alt='category-icon' className='icon'/>
                    <h4>Categories</h4>
                    <img src={Images.dropDownIcon} alt='drop-down'/>
                </div>

                <div>
                    <img src={Images.packageIcon} alt='package-icon' className='icon'/>
                    <h4>Packages </h4>
                    <img src={Images.dropDownIcon} alt='drop-down'/>
                </div>

                <div>
                    <img src={Images.accountIcon} alt='account-icon' className='icon'/>
                    <h4>My Account </h4>
                    <img src={Images.dropDownIcon} alt='drop-icon'/>
                </div>

            </div>
            
            <img src={Images.menuIcon} alt='menu-down' className="menu-icon"/>
            

        </nav>
     );
}
 
export default Navbar;
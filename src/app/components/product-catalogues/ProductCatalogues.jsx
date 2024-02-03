import '../Departments.css'
import './ProductCatalogues.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddProductCatalogue from './AddProductCatalogue';



function ProductCatalogues() {

    const [filteredProductCatalogues, setFilteredProductCatalogues] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [productCatalogues, setProductCatalogues] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        // Convert text and query to strings to ensure compatibility with string methods
        text = String(text);
        query = String(query);
    
        // Escape special characters for use in a regular expression
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Split the text into parts based on the query matches
        const parts = text.split(regex);
    
        // Create an array to hold the resulting JSX elements
        const result = [];
    
        // Keep track of the current index in the original text
        let currentIndex = 0;
    
        parts.forEach((part, index) => {
            // Add the non-matching part
            result.push(<span key={`text-${index}`}>{part}</span>);
    
            // Calculate the length of the match in the original text
            const matchLength = text.substr(currentIndex + part.length).match(regex)?.[0]?.length || 0;
    
            if (matchLength > 0) {
                // Add the matching part wrapped in a highlight span
                const match = text.substr(currentIndex + part.length, matchLength);
                result.push(<span key={`highlight-${index}`} className="highlight">{match}</span>);
            }
    
            // Update the current index
            currentIndex += part.length + matchLength;
        });
    
        return result;
    }
    

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < productCatalogues.length; i++) {
            if (Object.values(productCatalogues[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (productCatalogues.length > 0 && isQueryFound) {
            const filtered = productCatalogues.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredProductCatalogues(filtered);
        }
    }, [productCatalogues, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getProductCatalogues() {
            try {
                const response = await axios.get('http://localhost:3050/product-catalogues');
                console.log('The response', response)
                const materialsArr = response.data.productCatalogues;
                setProductCatalogues(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getProductCatalogues();
    }, []);


    function handleAddingProductCatalogue() {
        dispatch(openDialog({
            children: ( 
                <AddProductCatalogue />
            )
        }))
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingProductCatalogue}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Product Catalogue</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Product Catalogues" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {productCatalogues.length > 0 && !isQueryFound ? productCatalogues.map((productCatalogue, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card productCatalogue"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog productCatalogue">
                                    <div>
                                        <CategoryIcon />
                                        <span className="productCatalogue-name">
                                            {productCatalogue.name}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="productCatalogue-description">
                                            {productCatalogue.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <CategoryIcon />
                            <span className="productCatalogue-name">
                                {productCatalogue.name}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="productCatalogue-description">
                                {productCatalogue.description}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredProductCatalogues && isQueryFound ? filteredProductCatalogues.map((productCatalogue, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card productCatalogue"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog productCatalogue">
                                <div>
                                    <CategoryIcon />
                                    <span className="productCatalogue-name">
                                        {highlightMatch(productCatalogue.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="productCatalogue-description">
                                        {highlightMatch(productCatalogue.description, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                            <div>
                                <CategoryIcon />
                                <span className="productCatalogue-name">
                                    {highlightMatch(productCatalogue.name, query)}
                                </span>
                            </div>
                            <div>
                                <DescriptionIcon />
                                <span className="productCatalogue-description">
                                    {highlightMatch(productCatalogue.description, query)}
                                </span>
                            </div>
                      </Paper>
                    </Grid>
                  )) : <div>Loading...</div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default ProductCatalogues;
import '../Departments.css'
import './ProductCatalogues.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddProductCatalogue from './AddProductCatalogue';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../Delete';

function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}

function ProductCatalogues() {

    const [filteredProductCatalogues, setFilteredProductCatalogues] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [productCatalogues, setProductCatalogues] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Replace matches in the text with a highlighted span
        const highlightedText = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
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

    function handleEdit(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <AddProductCatalogue prdctCatalogue={productCatalogues[i]} />
                )
            }));
        }, 100);
    }

    function handleDelete(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                // you need to pass the user id to the 
                // component, so you can easily delete it
                children: ( 
                    <Delete itemId={i} />
                )
            }));
        }, 100);
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
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                {trimText(productCatalogue.description, 30)}
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
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                    {highlightMatch(trimText(productCatalogue.description, 30), query)}
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
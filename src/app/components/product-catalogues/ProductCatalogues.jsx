import '../Departments.css'
import './ProductCatalogues.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddProductCatalogue from './AddProductCatalogue';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../Delete';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';




function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function ProductCatalogues() {

    const { t, i18n } = useTranslation('cataloguesPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

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
    
    function showMsg(msg, status) {
    
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg, // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: status // success error info warning null
        })), 100);
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

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "productcatalog", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedProductCatalogues = res.data.map(ctlg => ({
                    id: ctlg.Id,
                    name: ctlg.ProductCatalogName,
                    description: ctlg.ProductCatalogDescription,
                }));
                setProductCatalogues(formattedProductCatalogues); 
                setIsQueryFound(formattedProductCatalogues.length > 0);
            }
        } catch (_error) {
            showMsg(_error.message, 'error') 
        } finally {
            setIsLoading(false); 
        }
    }

    useEffect(() => {
        async function getProductCatalogues() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "productcatalog",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The response', res)
                    const formatted = res.data.productCatalogs.map(ctlg => ({
                        id: ctlg.Id,
                        name: ctlg.ProductCatalogName,
                        description: ctlg.ProductCatalogDescription,
                    }));
                    console.log('The data', res)
                    setProductCatalogues(formatted)
                    setTotalCtlgs(res.data.count)
                }
            } catch (_error) {
                showMsg(_error.messgae, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getProductCatalogues();
    }, []);

    function handleSearchButtonClick() {
        if (query && query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }

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
                    <Delete itemId={productCatalogues[i].id} itemType="productcatalog" />
                )
            }));
        }, 100);
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
               
                <button id="btn-generic" className="add-btn" onClick={handleAddingProductCatalogue}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_PRODUCT_CATALOGUE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    label={t('SEARCH_PRODUCT_CATALOGUES')} type="search"
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button>

            </div>  

            <div className="main-content">
            {
                    isLoading ?
                    (
                        <div className='progress-container'>
                            <CircularProgress />
                        </div>
                    ) 
                     : productCatalogues.length > 0 ? 
                     (
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
                     ) : (
                        <div className='progress-container'>
                             {t('NO_PRODUCT_CATALOGUE_AVAILABLE')}
                        </div>
                    )
                }
                {
                    productCatalogues.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalCtlgs / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }
            </div>

        </div>
    )
}

export default ProductCatalogues;
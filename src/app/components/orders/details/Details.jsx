import '../../../components/Departments.css'
import './Details.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddDetails from './AddDetails';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PatternIcon from '@mui/icons-material/Pattern';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LabelIcon from '@mui/icons-material/Label';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





function Details() {

    const { t, i18n } = useTranslation('orderDetailsPage');
    const lang = i18n.language;
    
    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredDetails, setFilteredDetails] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [details, setDetails] = useState([]);
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
        for (let i = 0; i < details.length; i++) {
            if (Object.values(details[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (details.length > 0 && isQueryFound) {
            const filtered = details.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredDetails(filtered);
        }
    }, [details, query, isQueryFound]);


    useEffect(() => {
        async function getOrderDetails() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "orderdetail",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    const formatted = res.data.orderDetails.map(ctgr => ({ 
                        id: ctgr.Id,
                        orderNumber: ctgr.Orders,
                        quantityDetails: ctgr.QuantityDetails,
                        productCatalogue: ctgr.ProductCatalogDetails,
                        modelQuantity: ctgr.ModelQuantity,
                    }));
                    setTotalCtlgs(res.data.count)
                    setDetails(formatted)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getOrderDetails();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddDetails dtls={false} />
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
                    <AddDetails dtls={details[i]} />
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
                    <Delete itemId={details[i].id} itemType='orderdetail' />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "orderdetail", // Adapted to search for order details
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedDetails = res.data.map(detail => ({ 
                    id: detail.Id,
                    orderNumber: detail.Orders,
                    quantityDetails: detail.QuantityDetails,
                    productCatalogue: detail.ProductCatalogDetails,
                    modelQuantity: detail.ModelQuantity,
                }));
                setDetails(formattedDetails); // Adapted to set order details
                setIsQueryFound(formattedDetails.length > 0);
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

    
    function handleSearchButtonClick() {
        if (query && query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button id="btn-generic" className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>{t('ADD_DETAILS')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_DETAILS')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} 
                disabled={isLoading} onClick={handleSearchButtonClick}>
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
                     : details.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {details.length > 0 && !isQueryFound ? details.map((detail, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card detail"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog detail">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="order-number">
                                                    {detail.orderNumber.OrderNumber}
                                                </span>
                                            </div>
                                            <div>
                                                <ListAltIcon /> 
                                                <span className="quantity-details">
                                                    {detail.quantityDetails}
                                                </span>
                                            </div>
                                            <div>
                                                <MenuBookIcon />
                                                <span className="product-catalogue">
                                                    {detail.productCatalogue.ProductCatalog.ProductCatalogName}
                                                </span>
                                            </div>
                                            <div>
                                                <PlusOneIcon />
                                                <span className="model-quantity">
                                                    {detail.modelQuantity}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <ConfirmationNumberIcon /> 
                                    <span className="order-number">
                                        {detail.orderNumber.OrderNumber}
                                    </span>
                                </div>
                                <div>
                                    <MenuBookIcon />
                                    <span className="product-catalogue">
                                        {detail.productCatalogue.ProductCatalog.ProductCatalogName}
                                    </span>
                                </div>
                                <div>
                                    <PlusOneIcon />
                                    <span className="model-quantity">
                                        {detail.modelQuantity}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredDetails && isQueryFound ? filteredDetails.map((detail, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card detail"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog detail">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="order-number">
                                                    {highlightMatch(detail.orderNumber.OrderNumber, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <ListAltIcon /> 
                                                <span className="quantity-details">
                                                    {highlightMatch(detail.quantityDetails, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <MenuBookIcon />
                                                <span className="product-catalogue">
                                                    {highlightMatch(detail.productCatalogue.ProductCatalog.ProductCatalogName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <PlusOneIcon />
                                                <span className="model-quantity">
                                                    {highlightMatch(detail.modelQuantity, query)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <ConfirmationNumberIcon /> 
                                    <span className="order-number">
                                        {highlightMatch(detail.orderNumber.OrderNumber, query)}
                                    </span>
                                </div>
                                <div>
                                    <MenuBookIcon />
                                    <span className="product-catalogue">
                                        {highlightMatch(detail.productCatalogue.ProductCatalog.ProductCatalogName, query)}
                                    </span>
                                </div>
                                <div>
                                    <PlusOneIcon />
                                    <span className="model-quantity">
                                        {highlightMatch(detail.modelQuantity, query)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : ""
                          }
                        </Grid>
                    </Box>
                     ) : (
                        <div className='progress-container'>
                            {t('NO_ORDER_DETAILS_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    details.length > 0 ?
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

export default Details;
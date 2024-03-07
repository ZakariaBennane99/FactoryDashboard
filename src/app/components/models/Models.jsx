import '../Departments.css'
import './Models.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import RulerIcon from '@mui/icons-material/Straighten';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import DescriptionIcon from '@mui/icons-material/Description';
import { showMessage } from 'app/store/fuse/messageSlice';
import Delete from '../Delete';
import AddOrder from './AddModel';
import jwtService from '../../../app/auth/services/jwtService'
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





function Models() {

    const { t, i18n } = useTranslation('modelsPage');
    const lang = i18n.language;
    
    // search
    const [searchError, setSearchError] = useState(false);


    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredOrders, setFilteredOrders] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [models, setModels] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }

        text = String(text);
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');

        console.log('THE TEXT', text + '\n' + 'THE TEXT TYPE', typeof text)
    
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
        console.log('THE MODELS', models)
        for (let i = 0; i < models.length; i++) {
            if (Object.values(models[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
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

    useEffect(() => {
        if (models.length > 0 && isQueryFound) {
            const filtered = models.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredOrders(filtered);
        }
    }, [models, query, isQueryFound]);


    useEffect(() => {
        async function getModels() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "model",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The res', res)
                    const formatted = res.data.models.map(model => ({
                        id: model.Id,
                        modelName: model.ModelName,
                        order: model.Orders,
                        orderDetails: model.OrderDetail,
                        modelImage: `http://localhost:3002/${model.ModelImage}`, 
                        color: model.Color,
                        size: model.Size,
                        quantity: model.Quantity,
                        quantityDetails: model.QuantityDetails,
                        notes: model.Note
                      }));
                    setTotalCtlgs(res.data.count)
                    setModels(formatted)
                }
            } catch (error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getModels();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddOrder mdl={false} />
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
                    <AddOrder mdl={models[i]} />
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
                    <Delete itemId={models[i].id} itemType='model' />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "model", // Changed to search for models
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                // Adapt the mapping to the structure of models data
                const formattedModels = res.data.map(model => ({
                    id: model.Id,
                    modelName: model.ModelName,
                    order: model.Orders,
                    orderDetails: model.OrderDetail,
                    modelImage: `http://localhost:3002/${model.ModelImage}`, 
                    color: model.Color,
                    size: model.Size,
                    quantity: model.Quantity,
                    quantityDetails: model.QuantityDetails,
                    notes: model.Note
                }));
                setModels(formattedModels); // Update the state with the fetched models
                setIsQueryFound(formattedModels.length > 0);
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
                    <span>{t('ADD_MODEL')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_MODELS')}
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
                     : models.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {models.length > 0 && !isQueryFound ? models.map((model, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card Model"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog Model">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="model-name">
                                                    {model.order.Id}
                                                </span>
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="model-date">
                                                    {model.id}
                                                </span>
                                            </div>
                                            <div>
                                                <NoteAddIcon /> 
                                                <span className="model-amount">
                                                    {model.modelName}
                                                </span>
                                            </div>
                                            <div>
                                                <PaletteIcon /> 
                                                <span className="model-date">
                                                    {model.color.ColorName}
                                                </span>
                                            </div>
                                            <div>
                                                <RulerIcon /> 
                                                <span className="model-status">
                                                    {model.size.SizeName}
                                                </span>
                                            </div>
                                            <div>
                                                <PlusOneIcon />
                                                <span className="model-date">
                                                    {model.quantity}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="model-status">
                                                    {model.quantityDetails}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="model-date">
                                                    {model.notes}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <NoteAddIcon /> 
                                    <span className="model-amount">
                                        {model.modelName}
                                    </span>
                                </div>
                                <div>
                                    <PaletteIcon /> 
                                    <span className="model-date">
                                        {model.color.ColorName}
                                    </span>
                                </div>
                                <div>
                                    <RulerIcon /> 
                                    <span className="model-status">
                                        {model.size.SizeName}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredOrders && isQueryFound ? filteredOrders.map((model, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card Model"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog Model">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="model-name">
                                                    {highlightMatch(model.order.Id, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <ConfirmationNumberIcon /> 
                                                <span className="model-date">
                                                    {highlightMatch(model.id, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <NoteAddIcon /> 
                                                <span className="model-amount">
                                                    {highlightMatch(model.modelName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <PaletteIcon /> 
                                                <span className="model-date">
                                                    {highlightMatch(model.color.ColorName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <RulerIcon /> 
                                                <span className="model-status">
                                                    {highlightMatch(model.size.SizeName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <PlusOneIcon />
                                                <span className="model-date">
                                                    {highlightMatch(model.quantity, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="model-status">
                                                    {highlightMatch(model.quantityDetails, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="model-date">
                                                    {highlightMatch(model.notes, query)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <NoteAddIcon /> 
                                    <span className="model-amount">
                                        {model.modelName}
                                    </span>
                                </div>
                                <div>
                                    <PaletteIcon /> 
                                    <span className="model-date">
                                        {model.color.ColorName}
                                    </span>
                                </div>
                                <div>
                                    <RulerIcon /> 
                                    <span className="model-status">
                                        {model.size.SizeName}
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
                            {t('NO_MODEL_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    models.length > 0 ?
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

export default Models;
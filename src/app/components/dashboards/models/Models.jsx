import '../../Departments.css'
import './Models.css'
import { TextField, Box, Grid, Paper, FormControl } from '@mui/material'
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import SearchIcon from '@mui/icons-material/Search'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import RulerIcon from '@mui/icons-material/Straighten';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import DescriptionIcon from '@mui/icons-material/Description';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useAppSelector } from 'app/store';
import arLocale from 'date-fns/locale/ar-SA';
import { useLocation } from 'react-router-dom';
import { selectFuseDialogState } from 'app/store/fuse/dialogSlice';
import { useNavigate } from 'react-router-dom';
import jwtService from '../../../auth/services/jwtService/jwtService';
import Dialog from '@mui/material/Dialog';
import ShowManStages from './ShowManStages'
import Pagination from '@mui/material/Pagination';
import { useTranslation } from 'react-i18next';





function Models() {

    const { t, i18n } = useTranslation('modelsPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const [specificModel, setSpecificModel] = useState(null);

    const isFirstRender = useRef(true);

    let location = useLocation();
    let navigate = useNavigate();

    const [filteredOrders, setFilteredOrders] = useState(null);

    const isDialogOpen = useAppSelector(selectFuseDialogState);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [models, setModels] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
    const [searchReq, setSearchReq] = useState({
        from: null,
        to: null,
        query: ''
    })

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
        const stringifiedQry = query.toString()
        setQuery(stringifiedQry);
    
        const found = models.some(model => 
            Object.values(model).some(value => 
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )
        );
    
        setIsQueryFound(found);
    
        if (!found) {
            // If the search query is not available, perform a 
            // post request to the backend using the searchReq
            // then set the 'orders' to it
            
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


    async function fetchSearchResults() {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "model", 
                query: searchReq.query,
                from: searchReq.from,
                to: searchReq.to
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedModels = res.data.map(model => ({
                    id: model.Id,
                    modelName: model.ModelName,
                    orderNumber: model.Orders.OrderNumber,
                    orderDetails: model.OrderDetail,
                    templateName: model.Template.TemplateName, 
                    color: model.Color.ColorName,
                    size: model.Size.SizeName,
                    quantity: model.Quantity,
                    quantityDetails: model.QuantityDetails,
                    notes: model.Note
                }));
                setModels(formattedModels); // Updating models state instead of warehouses
                setIsQueryFound(formattedModels.length > 0); // Reflecting search result found status
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

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
                        orderNumber: model.Orders.OrderNumber,
                        orderDetails: model.OrderDetail,
                        templateName: model.Template.TemplateName, 
                        color: model.Color.ColorName,
                        size: model.Size.SizeName,
                        quantity: model.Quantity,
                        quantityDetails: model.QuantityDetails,
                        notes: model.Note
                    }));
                    setTotalUsers(res.data.count)
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


    const handleFromDateChange = (newValue) => {
        setSearchReq(prevState => ({
            ...prevState,
            from: newValue
        }));
    };


    // Handler for the "To" DatePicker
    const handleToDateChange = (newValue) => {
        setSearchReq(prevState => ({
            ...prevState,
            to: newValue
        }));
    };


    const getModelById = async (modelId) => {
        try {
            const res = await jwtService.getItemById({ 
                itemType: "model",
                itemId: modelId
            });
            if (res.status === 200) {
                const model = res.data;
                const formattedModel = {
                    id: model.Id,
                    modelName: model.ModelName,
                    orderNumber: model.Orders.OrderNumber,
                    orderDetails: model.OrderDetail.QuantityDetails, 
                    templateName: model.Template.TemplateName, 
                    color: model.Color.ColorName,
                    size: model.Size.SizeName,
                    quantity: model.Quantity,
                    quantityDetails: model.QuantityDetails,
                    notes: model.Note
                };
                setSpecificModel(formattedModel)
            } else if (res.status === 404) {
                setSpecificModel(null);
                navigate('/models'); 
            }
        } catch (error) {
            console.log('THE ERROR', error)
            showMsg(error.message, 'error')
        }
    };


    useEffect(() => {
        const modelId = new URLSearchParams(location.search).get('modelId');
        if (modelId) {
            getModelById(modelId);
        }
    }, [location]);


    useEffect(() => {

        if (isFirstRender.current) {
            // If it's the first render, do nothing but flip the flag
            isFirstRender.current = false;
            return;
        }

        if (!isDialogOpen && location.pathname.match(/\/dashboards\/models\/([^\/]+)/)?.[1]) {
            navigate('/dashboards/models');
        }
    }, [isDialogOpen]);



    const handleClose = () => {
        setSpecificModel(null);
        navigate('/dashboards/models'); 
    };

    function handleSearchButtonClick() {
        if (searchReq.query && searchReq.query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }


    function handleManufacturingStages(modelId, modelQuantity) {
        // first close the current window
        setSpecificModel(null);
        navigate('/dashboards/models'); 
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <ShowManStages modelId={modelId} quantity={modelQuantity} />
                )
            }));
        }, 100);
    }   


    return (
        <div className="parent-container">

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={lang === 'ar' ? arLocale : undefined}>
                <div className="top-ribbon" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className={`datePicker ${lang === 'ar' ? 'rtl' : ''}`}
                            label={t('FROM')}
                            value={searchReq.from}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className={`datePicker ${lang === 'ar' ? 'rtl' : ''}`}
                            label={t('TO')}
                            value={searchReq.to}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <TextField
                        className={`search dash-search ${lang === 'ar' ? 'rtl' : ''}`} 
                        label={t('SEARCH_ORDERS')}
                        onChange={(e) => handleSearch(e)}  
                        type="search"
                        error={searchError}
                        helperText={searchError ? t('QUERY_ERROR') : ""} />
                    <button className={`search-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                        <SearchIcon />
                        <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                    </button>
                </div>  
            </LocalizationProvider> 

            <div className="main-content">

                {
                    isLoading ?<div className="progress-container">
                    <CircularProgress />  
                  </div>
                     : ''
                }

                {
                    specificModel ? 
                    <Dialog
                        open={specificModel}
                        onClose={handleClose}
                        aria-labelledby="model-dialog-title"
                        style={{ borderRadius: '8px' }}
                    >
                                <div className="depart-card dialog Model">
                                    <button onClick={() => handleManufacturingStages(specificModel.id, specificModel.quantity)} 
                                        id="man-stages-btn" 
                                        className="add-user-btn"
                                    >
                                        Show Manufacturing Stages
                                    </button>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-name">
                                            {specificModel.modelName}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-date">
                                            {specificModel.orderNumber}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="model-status">
                                            {specificModel.templateName}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="model-date">
                                            {specificModel.color}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="model-status">
                                            {specificModel.size}
                                        </span>
                                    </div>
                                    <div>
                                        <PlusOneIcon />
                                        <span className="model-date">
                                            {specificModel.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="model-status">
                                            {specificModel.quantityDetails}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="model-date">
                                            {specificModel.notes}
                                        </span>
                                    </div>
                                </div>
                    </Dialog>
                    : ''
                }
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
                                    <button onClick={() => handleManufacturingStages(model.id, model.quantity)} 
                                        id="man-stages-btn" 
                                        className="add-user-btn"
                                    >
                                        {t('SHOW_MANUFACTURING_STAGES')}
                                    </button>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-name">
                                            {model.modelName}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-date">
                                            {model.orderNumber}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="model-status">
                                            {model.templateName}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="model-date">
                                            {model.color}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="model-status">
                                            {model.size}
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
                            ),
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
                            <CategoryIcon /> 
                            <span className="model-status">
                                {model.templateName}
                            </span>
                        </div>
                        
                        <div>
                            <PaletteIcon /> 
                            <span className="model-date">
                                {model.color}
                            </span>
                        </div>
                        <div>
                            <RulerIcon /> 
                            <span className="model-status">
                                {model.size}
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
                                    <button onClick={() => handleManufacturingStages(model.modelId, model.quantity)} 
                                        id="man-stages-btn" 
                                        className="add-user-btn"
                                    >
                                        Show Manufacturing Stages
                                    </button>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-name">
                                            {highlightMatch(model.modelName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-date">
                                            {highlightMatch(model.orderNumber, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="model-status">
                                            {highlightMatch(model.templateName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="model-date">
                                            {highlightMatch(model.color, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="model-status">
                                            {highlightMatch(model.size, query)}
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
                            ),
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="model-amount">
                                {highlightMatch(model.modelName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="model-status">
                                {highlightMatch(model.templateName, query)}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon /> 
                            <span className="model-date">
                                {highlightMatch(model.color, query)}
                            </span>
                        </div>
                        <div>
                            <RulerIcon /> 
                            <span className="model-status">
                                {highlightMatch(model.size, query)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : ""
                  }
                </Grid>
            </Box>

                 {
                    models.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalUsers / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }

            </div>

        </div>
    )
}

export default Models;
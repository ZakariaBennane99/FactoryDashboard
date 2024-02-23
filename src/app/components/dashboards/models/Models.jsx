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
import EventIcon from '@mui/icons-material/Event';
import { CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useAppSelector } from 'app/store';
import { useLocation } from 'react-router-dom';
import { selectFuseDialogState } from 'app/store/fuse/dialogSlice';
import { useNavigate } from 'react-router-dom';
import jwtService from '../../../auth/services/jwtService/jwtService';
import Dialog from '@mui/material/Dialog';




function Models() {

    const currentUserId = window.localStorage.getItem('userId')

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


    useEffect(() => {
        async function getModels() {
            try {
                // @route: api/items/models
                // @description: get models
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "models"
                });
                if (res) {
                    setModels(res.models)
                }
            } catch (error) {
                console.log('ThE ERROR', error)
                // the error msg will be sent so you don't have to hardcode it
                showMsg(error, 'error')
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


    // If the user clicks on the link of the model, the DB id of the model
    // will be brought here, then we will fetch it separatly and add it here 

    const getModelById = async (modelId) => {
        console.log('WE ARE INSIDE THE GETMODELBYID')
        try {
            // @route: api/items/getModel
            // @description: get mode from the modelId
            const res = await jwtService.getIModelById({ 
                modelId: modelId
            });
            
            if (res.status === 201) {
                console.log("THE DATA FROM THE BACKEND", res.data)
                setSpecificModel(res.data)
            } else if (res.status === 404) {
                setSpecificModel(null);
                navigate('/models'); 
            }
        } catch (error) {
            console.log('THE ERROR', error)
            showMsg(error, 'error')
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

    useEffect(() => {
        console.log('THE SPECIFICMODE', specificModel)
    }, [])

    return (
        <div className="parent-container">

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="top-ribbon">
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className='datePicker'
                            label="From"
                            value={searchReq.from}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className="datePicker"
                            label="To"
                            value={searchReq.to}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <TextField
                        className="search dash-search" 
                        label="Search Orders"
                        onChange={(e) => handleSearch(e)}  />
                    <button className="search-btn">
                        <SearchIcon />
                        <span>Search</span>
                    </button>
                </div>  
            </LocalizationProvider> 


            <div className="main-content">
                {
                    specificModel ? 
                    <Dialog
                        open={specificModel}
                        onClose={handleClose}
                        aria-labelledby="model-dialog-title"
                        style={{ borderRadius: '8px' }}
                    >
                    <div className="depart-card dialog Model">
                            <div>
                                <ConfirmationNumberIcon /> 
                                <span className="model-name">
                                    {specificModel.modelName}
                                </span>
                            </div>
                            <div>
                                <ConfirmationNumberIcon /> 
                                <span className="model-date">
                                    {specificModel.modelId}
                                </span>
                            </div>
                            <div>
                                <NoteAddIcon /> 
                                <span className="model-amount">
                                    {specificModel.modelName}
                                </span>
                            </div>
                            <div>
                                <CategoryIcon /> 
                                <span className="model-status">
                                    {specificModel.templateType}
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
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-name">
                                            {model.orderId}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-date">
                                            {model.modelId}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="model-amount">
                                            {model.modelName}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="model-status">
                                            {model.templateType}
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
                                {model.templateType}
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
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-name">
                                            {highlightMatch(model.orderId, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <EventIcon />
                                        <span className="model-date">
                                            {highlightMatch(model.modelId, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="model-amount">
                                            {highlightMatch(model.modelName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="model-status">
                                            {highlightMatch(model.templateType, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="model-date">
                                            {highlightMatch(model.templateType, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="model-status">
                                            {highlightMatch(model.templateType, query)}
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
                                {highlightMatch(model.modelName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="model-status">
                                {highlightMatch(model.templateType, query)}
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
                  )) :                   
                  <div className="progress-container">
                    <CircularProgress />  
                  </div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default Models;
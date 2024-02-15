import '../Departments.css'
import './Models.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import RulerIcon from '@mui/icons-material/Straighten';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import DescriptionIcon from '@mui/icons-material/Description';
import Delete from '../Delete';
import AddOrder from './AddModel';
import EventIcon from '@mui/icons-material/Event';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';




function Models() {

    const [filteredOrders, setFilteredOrders] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [models, setOrders] = useState([]);
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
        for (let i = 0; i < Models.length; i++) {
            if (Object.values(Models[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (Models.length > 0 && isQueryFound) {
            const filtered = Models.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredOrders(filtered);
        }
    }, [Models, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getModels() {
            try {
                const response = await axios.get('http://localhost:3050/models');
                console.log('The response', response)
                const materialsArr = response.data.models;
                setOrders(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getModels();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddOrder ordr={false} />
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
                    <AddOrder ordr={models[i]} />
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
                    <Delete itemId={i} itemType='model' />
                )
            }));
        }, 100);
    }

    function getStatusIcon(status) {
        switch (status) {
          case 'PENDING':
            return <HourglassEmptyIcon />;
          case 'APPROVED':
            return <CheckCircleOutlineIcon />;
          case 'FULFILLED':
            return <TaskAltIcon />;
          case 'CANCELLED':
            return <CancelIcon />;
          case 'COMPLETED':
            return <DoneAllIcon />;
          case 'ONGOING':
            return <AutorenewIcon />;
          case 'REJECTED':
            return <RemoveCircleOutlineIcon />;
          default:
            return null; // or a default icon
        }
    }

    function getSeasonIcon(season) {
        switch (season.toUpperCase()) {
          case 'WINTER':
            return <AcUnitIcon />;
          case 'SUMMER':
            return <WbSunnyIcon />;
          case 'AUTUMN':
            return <FilterDramaIcon />;
          case 'SPRING':
            return <LocalFloristIcon />;
          default:
            return null; 
        }
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Model</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Models" Model="search" />
            </div>  

            <div className="main-content">
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
                                            {model.orderId}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="model-date">
                                            {model.modelNumber}
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
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                            {highlightMatch(model.modelNumber, query)}
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
                  )) : <div>Loading...</div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default Models;
import '../../../components/Departments.css'
import './Details.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
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



function Details() {

    const [filteredDetails, setFilteredDetails] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [details, setMaterials] = useState([]);
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
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/order-details');
                console.log('The response', response)
                const materialsArr = response.data.details;
                setMaterials(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
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
                    <Delete itemId={i} />
                )
            }));
        }, 100);
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Detail</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Details" type="search" />

            </div>  

            <div className="main-content">
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
                                            {detail.orderNumber}
                                        </span>
                                    </div>
                                    <div>
                                        <ListAltIcon /> 
                                        <span className="quantity-details">
                                            {detail.quantityDetails}
                                        </span>
                                    </div>
                                    <div>
                                        <PatternIcon />
                                        <span className="template-pattern">
                                            {detail.templatePattern}
                                        </span>
                                    </div>
                                    <div>
                                        <MenuBookIcon />
                                        <span className="product-catalogue">
                                            {detail.productCatalogue}
                                        </span>
                                    </div>
                                    <div>
                                        <LabelIcon />
                                        <span className="model-name">
                                            {detail.modelName}
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
                                {detail.orderNumber}
                            </span>
                        </div>
                        <div>
                            <MenuBookIcon />
                            <span className="product-catalogue">
                                {detail.productCatalogue}
                            </span>
                        </div>
                        <div>
                            <LabelIcon />
                            <span className="model-name">
                                {detail.modelName}
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
                                            {highlightMatch(detail.orderNumber, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <ListAltIcon /> 
                                        <span className="quantity-details">
                                            {highlightMatch(detail.quantityDetails, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PatternIcon />
                                        <span className="template-pattern">
                                            {highlightMatch(detail.templatePattern, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <MenuBookIcon />
                                        <span className="product-catalogue">
                                            {highlightMatch(detail.productCatalogue, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <LabelIcon />
                                        <span className="model-name">
                                            {highlightMatch(detail.modelName, query)}
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
                                {highlightMatch(detail.orderNumber, query)}
                            </span>
                        </div>
                        <div>
                            <MenuBookIcon />
                            <span className="product-catalogue">
                                {highlightMatch(detail.productCatalogue, query)}
                            </span>
                        </div>
                        <div>
                            <LabelIcon />
                            <span className="model-name">
                                {highlightMatch(detail.modelName, query)}
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
                  )) : <div>Loading...</div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default Details;
import '../../../Departments.css'
import './TemplateTypes.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../Delete';
import AddTemplateType from './AddTemplateType';
import ListIcon from '@mui/icons-material/List';
import StyleIcon from '@mui/icons-material/Style';
import jwtService from '../../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function TemplateTypes() {

    const currentUserId = window.localStorage.getItem('userId')

    const [filteredTemplateTypes, setFilteredTemplateTypes] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [templateTypes, setMaterials] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }
    
        // Convert both text and query to string to ensure numbers are handled correctly
        const textString = String(text);
        const queryString = String(query);
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = queryString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
        // Replace matches in the text with a highlighted span
        const highlightedText = textString.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    }
    

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < templateTypes.length; i++) {
            if (Object.values(templateTypes[i]).some(value =>
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
        if (templateTypes.length > 0 && isQueryFound) {
            const filtered = templateTypes.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTemplateTypes(filtered);
        }
    }, [templateTypes, query, isQueryFound]);


    useEffect(() => {
        async function getTemplateTypes() {
            try {
                // @route: api/items/templateTypes
                // @description: get Template Types
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "templateTypes"
                });
                if (res) {
                    setSizes(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getTemplateTypes();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddTemplateType tmplTypes={false} />
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
                    <AddTemplateType tmplTypes={templateTypes[i]} />
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
                    <Delete itemId={i} itemType='templateTypes' />
                )
            }));
        }, 100);
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Template Type</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Template Types" templateType="search" />
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {templateTypes.length > 0 && !isQueryFound ? templateTypes.map((templateType, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card templateType"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog templateType">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <ListIcon /> 
                                        <span className="order-detail-name">
                                            {templateType.orderDetailName}
                                        </span>
                                    </div>
                                    <div>
                                        <StyleIcon />
                                        <span className="template-type-name">
                                            {templateType.templateTypeName}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >  
                        <div>
                            <ListIcon /> 
                            <span className="order-detail-name">
                                {templateType.orderDetailName}
                            </span>
                        </div>
                        <div>
                            <StyleIcon />
                            <span className="template-type-name">
                                {templateType.templateTypeName}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredTemplateTypes && isQueryFound ? filteredTemplateTypes.map((templateType, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card templateType"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog templateType">
                                <div id="edit-container">
                                    <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                    <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div>
                                    <ListIcon /> 
                                    <span className="order-detail-name">
                                        {highlightMatch(templateType.orderDetailName, query)}
                                    </span>
                                </div>
                                <div>
                                    <StyleIcon />
                                    <span className="template-type-name">
                                        {highlightMatch(templateType.templateTypeName, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <ListIcon /> 
                            <span className="order-detail-name">
                                {highlightMatch(templateType.orderDetailName, query)}
                            </span>
                        </div>
                        <div>
                            <StyleIcon />
                            <span className="template-type-name">
                                {highlightMatch(templateType.templateTypeName, query)}
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

export default TemplateTypes;
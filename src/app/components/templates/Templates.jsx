import '../../components/Departments.css'
import './Templates.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../components/Delete';
import AddTemplate from './AddTemplate';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Templates() {

    const currentUserId = window.localStorage.getItem('userId');

    const [filteredTemplates, setFilteredTemplates] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [templates, setTemplates] = useState([]);
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
        for (let i = 0; i < templates.length; i++) {
            if (Object.values(templates[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (templates.length > 0 && isQueryFound) {
            const filtered = templates.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTemplates(filtered);
        }
    }, [templates, query, isQueryFound]);


    useEffect(() => {
        async function getTemplates() {
            try {
                // @route: api/items/templates
                // @description: get a list of templates
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "templates"
                });
                if (res) {
                    setTemplates(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getTemplates();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddTemplate tmplt={false} />
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
                    <AddTemplate tmplt={templates[i]} />
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
                    <Delete itemId={templates[i].templateId} itemType="templates" />
                )
            }));
        }, 100);
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Template</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Templates" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {templates.length > 0 && !isQueryFound ? templates.map((template, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card template"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog template">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="template-name">
                                            {template.templateName}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="product-catalogue">
                                            {template.productCatalogueDetail}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="template-description">
                                            {template.description}
                                        </span>
                                    </div>
                                    <div>
                                        <InsertDriveFileIcon />
                                        <span className="template-specifics">
                                            {template.fileName}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="template-name">
                                {template.templateName}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="product-catalogue">
                                {template.productCatalogueDetail}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="template-description">
                                {trimText(template.description, 30)}
                            </span>
                        </div>
                        <div>
                            <InsertDriveFileIcon />
                            <span className="template-specifics">
                                {template.fileName}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredTemplates && isQueryFound ? filteredTemplates.map((template, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card template"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog template">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="template-name">
                                            {highlightMatch(template.templateName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="product-catalogue">
                                            {highlightMatch(template.productCatalogueDetail, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="template-description">
                                            {highlightMatch(template.description, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <InsertDriveFileIcon />
                                        <span className="template-specifics">
                                            {highlightMatch(template.fileName, query)}
                                        </span>
                                    </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="template-name">
                                {highlightMatch(template.templateName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="product-catalogue">
                                {highlightMatch(template.productCatalogueDetail, query)}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="template-description">
                                {highlightMatch(trimText(template.description, 30), query)}
                            </span>
                        </div>
                        <div>
                            <InsertDriveFileIcon />
                            <span className="template-specifics">
                                {highlightMatch(template.fileName, query)}
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

export default Templates;
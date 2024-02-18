
import '../../Departments.css'
import './Textiles.css'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import { TextField, Box, Grid, Paper } from '@mui/material'
import TextureIcon from '@mui/icons-material/Texture';
import GrainIcon from '@mui/icons-material/Grain';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddTextile from './AddTextile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Textiles() {

    const currentUserId = window.localStorage.getItem('userId');

    const [filteredTextiles, setFilteredTextiles] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [textiles, setTextiles] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        // Convert text and query to strings to ensure compatibility with string methods
        text = String(text);
        query = String(query);
    
        // Escape special characters for use in a regular expression
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Split the text into parts based on the query matches
        const parts = text.split(regex);
    
        // Create an array to hold the resulting JSX elements
        const result = [];
    
        // Keep track of the current index in the original text
        let currentIndex = 0;
    
        parts.forEach((part, index) => {
            // Add the non-matching part
            result.push(<span key={`text-${index}`}>{part}</span>);
    
            // Calculate the length of the match in the original text
            const matchLength = text.substr(currentIndex + part.length).match(regex)?.[0]?.length || 0;
    
            if (matchLength > 0) {
                // Add the matching part wrapped in a highlight span
                const match = text.substr(currentIndex + part.length, matchLength);
                result.push(<span key={`highlight-${index}`} className="highlight">{match}</span>);
            }
    
            // Update the current index
            currentIndex += part.length + matchLength;
        });
    
        return result;
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
        for (let i = 0; i < textiles.length; i++) {
            if (Object.values(textiles[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (textiles.length > 0 && isQueryFound) {
            const filtered = textiles.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTextiles(filtered);
        }
    }, [textiles, query, isQueryFound]);


    useEffect(() => {

        async function getTextiles() {
            try {
                // @route: api/items/textiles
                // @description: get textiles
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "textiles"
                });
                if (res) {
                    setTextiles(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getTextiles();
    }, []);


    function handleAddingTextile() {
        dispatch(openDialog({
            children: ( 
                <AddTextile />
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
                    <AddTextile txtle={textiles[i]} />
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
                    <Delete itemId={i} itemType='textiles' />
                )
            }));
        }, 100);
    }



    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingTextile}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Textile</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Textiles" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {textiles.length > 0 && !isQueryFound ? textiles.map((textile, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card textile"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog textile">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <TextureIcon />
                                        <span className="textile-name">
                                            {textile.textileName}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="textile-type">
                                            {textile.textileType}
                                        </span>
                                    </div>
                                    <div>
                                        <GrainIcon />
                                        <span className="textile-composition">
                                            {textile.composition}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="textile-description">
                                            {textile.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <TextureIcon />
                            <span className="textile-name">
                                {textile.textileName}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="textile-type">
                                {textile.textileType}
                            </span>
                        </div>
                        <div>
                            <GrainIcon />
                            <span className="textile-composition">
                                {textile.composition}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="textile-description">
                                {trimText(textile.description, 30)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredTextiles && isQueryFound ? filteredTextiles.map((textile, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card textile"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog textile">
                                <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div>
                                    <TextureIcon />
                                    <span className="textile-name">
                                        {highlightMatch(textile.textileName, query)}
                                    </span>
                                </div>
                                <div>
                                    <CategoryIcon /> 
                                    <span className="textile-type">
                                        {highlightMatch(textile.textileType, query)}
                                    </span>
                                </div>
                                <div>
                                    <GrainIcon />
                                    <span className="textile-composition">
                                        {highlightMatch(textile.composition, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="textile-description">
                                        {highlightMatch(textile.description, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <TextureIcon />
                            <span className="textile-name">
                                {highlightMatch(textile.textileName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="textile-type">
                                {highlightMatch(textile.textileType, query)}
                            </span>
                        </div>
                        <div>
                            <GrainIcon />
                            <span className="textile-composition">
                                {highlightMatch(textile.composition, query)}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="textile-description">
                                {highlightMatch(trimText(textile.description, 30), query)}
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

export default Textiles;
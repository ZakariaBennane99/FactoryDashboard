import '../../../Departments.css'
import './Colors.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../Delete';
import AddColor from './AddColor';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaletteIcon from '@mui/icons-material/Palette';
import tinycolor from 'tinycolor2';
import jwtService from '../../../../../app/auth/services/jwtService'
import { showMessage } from 'app/store/fuse/messageSlice';





function Colors() {

    const currentUserId = window.localStorage.getItem('userId')

    const [filteredColors, setFilteredColors] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [colors, setColors] = useState([]);
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
        for (let i = 0; i < colors.length; i++) {
            if (Object.values(colors[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (colors.length > 0 && isQueryFound) {
            const filtered = colors.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredColors(filtered);
        }
    }, [colors, query, isQueryFound]);

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
        async function getCatalogueColors() {
            try {
                // @route: api/items/catalogueColors
                // @description: get catalogue Colors
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "catalogueColors"
                });
                if (res) {
                    setColors(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getCatalogueColors();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddColor clr={false} />
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
                    <AddColor clr={colors[i]} />
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
                    <Delete itemId={colors[i].colorId} itemType='cataloguesColor' />
                )
            }));
        }, 100);
    }


    
    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Color</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Colors" color="search" />
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {colors.length > 0 && !isQueryFound ? colors.map((color, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card color"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog color">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="order">
                                            {color.orderId}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon />
                                        <span className="color-name" style={{ 
                                            backgroundColor: color.colorName.toLocaleLowerCase(), 
                                            color: tinycolor(color.colorName.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                            {color.colorName}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >   <div>
                            <ConfirmationNumberIcon /> 
                            <span className="order">
                                {color.orderId}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon />
                            <span className="color-name" style={{ 
                                    backgroundColor: color.colorName.toLocaleLowerCase(), 
                                    color: tinycolor(color.colorName.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                {color.colorName}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredColors && isQueryFound ? filteredColors.map((color, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card color"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog color">
                                <div id="edit-container">
                                    <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                    <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div>
                                    <ConfirmationNumberIcon /> 
                                    <span className="order">
                                        {highlightMatch(color.orderId, query)}
                                    </span>
                                </div>
                                <div>
                                    <PaletteIcon />
                                    <span className="color-name" style={{ 
                                        backgroundColor: color.colorName.toLocaleLowerCase(), 
                                        color: tinycolor(color.colorName.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                        {highlightMatch(color.colorName, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <ConfirmationNumberIcon /> 
                            <span className="order">
                                {highlightMatch(color.orderId, query)}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon />
                            <span className="color-name" style={{ 
                                backgroundColor: color.colorName.toLocaleLowerCase(), 
                                color: tinycolor(color.colorName.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                {highlightMatch(color.colorName, query)}
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

export default Colors;
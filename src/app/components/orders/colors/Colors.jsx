import '../../Departments.css'
import './Colors.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import AddColors from './AddColor';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorizeIcon from '@mui/icons-material/Colorize';
import DescriptionIcon from '@mui/icons-material/Description';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}



function Colors() {

    const { t, i18n } = useTranslation('colorsPage');
    const lang = i18n.language;
    
    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

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


    useEffect(() => {
        async function getModelColors() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "color",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The res', res)
                    const formatted = res.data.colors.map(ctgr => ({ 
                        id: ctgr.Id,
                        colorName: ctgr.ColorName,
                        colorCode: ctgr.ColorCode,
                        description: ctgr.Description,
                    }));
                    setTotalCtlgs(res.data.count)
                    setColors(formatted)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getModelColors();
    }, []);

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

    function handleAddingColors() {
        dispatch(openDialog({
            children: ( 
                <AddColors clr={false} />
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
                    <AddColors clr={colors[i]} />
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
                    <Delete itemId={colors[i].id} itemType='color' />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "color", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedColors = res.data.map(color => ({
                    id: color.Id,
                    colorName: color.ColorName,
                    colorCode: color.ColorCode,
                    description: color.Description,
                }));
                setColors(formattedColors); 
                setIsQueryFound(formattedColors.length > 0);
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

                <button id="btn-generic" className="add-btn" onClick={handleAddingColors}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>{t('ADD_COLOR')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_COLORS')}
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
                     : colors.length > 0 ? 
                    (
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
                                                <PaletteIcon /> 
                                                <span className="color-name">
                                                    {color.colorName}
                                                </span>
                                            </div>
                                            <div>
                                                <ColorizeIcon />
                                                <span className="color-code">
                                                    {color.colorCode}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="color-description">
                                                    {color.description}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >  
                                <div>
                                    <PaletteIcon /> 
                                    <span className="color-name">
                                        {color.colorName}
                                    </span>
                                </div>
                                <div>
                                    <ColorizeIcon />
                                    <span className="color-code">
                                        {color.colorCode}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="color-description">
                                        {trimText(color.description, 30)}
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
                                                <PaletteIcon /> 
                                                <span className="color-name">
                                                    {highlightMatch(color.colorName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <ColorizeIcon />
                                                <span className="color-code">
                                                    {highlightMatch(color.colorCode, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="color-description">
                                                    {highlightMatch(color.description, query)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <PaletteIcon /> 
                                    <span className="color-name">
                                        {highlightMatch(color.colorName, query)}
                                    </span>
                                </div>
                                <div>
                                    <ColorizeIcon />
                                    <span className="color-code">
                                        {highlightMatch(color.colorCode, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="color-description">
                                        {highlightMatch(trimText(color.description, 30), query)}
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
                            {t('NO_COLOR_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    colors.length > 0 ?
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

export default Colors;
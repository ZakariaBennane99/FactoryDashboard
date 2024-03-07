import '../../../components/Departments.css'
import './Patterns.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddPattern from './AddPattern';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';



function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Patterns() {

    const { t, i18n } = useTranslation('patternsPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredPatterns, setFilteredPatterns] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [patterns, setPatterns] = useState([]);
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
        for (let i = 0; i < patterns.length; i++) {
            if (Object.values(patterns[i]).some(value =>
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
        if (patterns.length > 0 && isQueryFound) {
            const filtered = patterns.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredPatterns(filtered);
        }
    }, [patterns, query, isQueryFound]);


    useEffect(() => {
        async function getMaterials() {

            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "templatepattern",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log(res)
                    const formatted = res.data.templates.map(ctgr => ({ 
                        id: ctgr.Id,
                        name: ctgr.TemplatePatternName,
                        description: ctgr.Description
                    }));
                    setTotalCtlgs(res.data.count)
                    setPatterns(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddPattern ptrn={false} />
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
                    <AddPattern ptrn={patterns[i]} />
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
                    <Delete itemId={patterns[i].id} itemType="templatepattern" />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "templatepattern", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
            
                const formattedPatterns = res.data.map(pattern => ({
                    id: pattern.Id,
                    name: pattern.TemplatePatternName,
                    description: pattern.Description
                }));
                setPatterns(formattedPatterns); 
                setIsQueryFound(formattedPatterns.length > 0);
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
                    <span>{t('ADD_PATTERN')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_PATTERNS')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
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
                     : patterns.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {patterns.length > 0 && !isQueryFound ? patterns.map((pattern, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card pattern"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog pattern">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <CategoryIcon /> 
                                                <span className="pattern-name">
                                                    {pattern.name}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="pattern-description">
                                                    {pattern.description}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >   <div>
                                    <CategoryIcon /> 
                                    <span className="pattern-name">
                                        {pattern.name}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="pattern-description">
                                        {trimText(pattern.description, 30)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredPatterns && isQueryFound ? filteredPatterns.map((pattern, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card pattern"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                    <div className="depart-card dialog pattern">
                                        <div id="edit-container">
                                            <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                            <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                        </div>
                                        <div>
                                            <CategoryIcon /> 
                                            <span className="pattern-name">
                                                {highlightMatch(pattern.name, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <DescriptionIcon />
                                            <span className="pattern-description">
                                                {highlightMatch(pattern.description, query)}
                                            </span>
                                        </div>
                                    </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <CategoryIcon /> 
                                    <span className="pattern-name">
                                        {highlightMatch(pattern.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="pattern-description">
                                        {highlightMatch(trimText(pattern.description, 30), query)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : ''
                          }
                        </Grid>
                    </Box>
                     ) : (
                        <div className='progress-container'>
                            {t('NO_PATTERN_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    patterns.length > 0 ?
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

export default Patterns;
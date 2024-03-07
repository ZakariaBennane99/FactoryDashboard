import '../../../components/Departments.css'
import './Types.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddType from './AddType';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next';





function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Types() {

    const { t, i18n } = useTranslation('typesPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredTypes, setFilteredTypes] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [types, setTypes] = useState([]);
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
        for (let i = 0; i < types.length; i++) {
            if (Object.values(types[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (types.length > 0 && isQueryFound) {
            const filtered = types.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTypes(filtered);
        }
    }, [types, query, isQueryFound]);


    useEffect(() => {
        async function getTypes() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "templatetype",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    const formatted = res.data.types.map(ctgr => ({ 
                        id: ctgr.Id,
                        name: ctgr.TemplateTypeName,
                        description: ctgr.Description
                    }));
                    setTotalCtlgs(res.data.count)
                    setTypes(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getTypes();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddType typs={false} />
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
                    <AddType typs={types[i]} />
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
                    <Delete itemId={types[i].id} itemType="templatetype" />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "templatetype", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedTypes = res.data.map(type => ({
                    id: type.Id,
                    name: type.TemplateTypeName, 
                    description: type.Description
                }));
                setTypes(formattedTypes); // Assuming setTypes is the function to update the types state
                setIsQueryFound(formattedTypes.length > 0);
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
                    <span>{t('ADD_TYPE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_TYPES')}
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
                     : types.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {types.length > 0 && !isQueryFound ? types.map((type, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card type"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog type">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <CategoryIcon /> 
                                                <span className="type-name">
                                                    {type.name}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon />
                                                <span className="type-description">
                                                    {type.description}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >   <div>
                                    <CategoryIcon /> 
                                    <span className="type-name">
                                        {type.name}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="type-description">
                                        {trimText(type.description, 30)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredTypes && isQueryFound ? filteredTypes.map((type, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card type"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                    <div className="depart-card dialog type">
                                        <div id="edit-container">
                                            <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                            <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                        </div>
                                        <div>
                                            <CategoryIcon /> 
                                            <span className="type-name">
                                                {highlightMatch(type.name, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <DescriptionIcon />
                                            <span className="type-description">
                                                {highlightMatch(type.description, query)}
                                            </span>
                                        </div>
                                    </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <CategoryIcon /> 
                                    <span className="type-name">
                                        {highlightMatch(type.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="type-description">
                                        {highlightMatch(trimText(type.description, 30), query)}
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
                            {t('NO_TEMPLATE_TYPES')}
                        </div>
                    )
                }
                {
                    types.length > 0 ?
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

export default Types;
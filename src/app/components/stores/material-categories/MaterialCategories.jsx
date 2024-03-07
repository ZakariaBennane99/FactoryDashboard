import '../../Departments.css'
import './MaterialCategories.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddMaterialCategory from './AddMaterialCategory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';




function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function MaterialCategories() {

    const { t, i18n } = useTranslation('materialCategoriesPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const [filteredMaterialCategories, setFilteredMaterialCategories] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materialCategories, setMaterialCategories] = useState([]);
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
    
    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "materialcategory",
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedMaterialCategories = res.data.materialCategories.map(mtrl => ({
                    id: mtrl.Id,
                    name: mtrl.CategoryName,
                    description: mtrl.Description
                }));
                setMaterialCategories(formattedMaterialCategories);
                setIsQueryFound(formattedMaterialCategories.length > 0);
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

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < materialCategories.length; i++) {
            if (Object.values(materialCategories[i]).some(value =>
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
        if (materialCategories.length > 0 && isQueryFound) {
            const filtered = materialCategories.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterialCategories(filtered);
        }
    }, [materialCategories, query, isQueryFound]);


    useEffect(() => {
        async function getMaterialCategories() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "materialcategory"
                });
                if (res.status === 200) {
                    setMaterialCategories(res.data.materialCategories.map(mtrl => {
                        return {
                            id: mtrl.Id,
                            name: mtrl.CategoryName,
                            description: mtrl.Description
                        }
                    }))
                    setTotalUsers(res.data.count)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getMaterialCategories();
    }, []);


    function handleAddingMaterialCategory() {
        dispatch(openDialog({
            children: ( 
                <AddMaterialCategory mtrlCat={false} />
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
                    <AddMaterialCategory mtrlCat={materialCategories[i]} />
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
                    <Delete itemId={materialCategories[i].id} itemType="materialcategory" />
                )
            }));
        }, 100);
    }
    


    return (
        <div className="parent-container">

            <div className="top-ribbon">

                <button id="btn-generic" className="add-btn" onClick={handleAddingMaterialCategory}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_MATERIAL_CATEGORY')}</span>
                </button>

                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_MATERIAL_CATEGORIES')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />

                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button>    

            </div>  

            <div className="main-content">
                {isLoading ? (
                    <div className='progress-container'>
                        <CircularProgress />
                    </div>
                ) : materialCategories.length > 0 ? 
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {materialCategories.length > 0 && !isQueryFound ? materialCategories.map((materialCategory, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card materialCategory"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog materialCategory">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="materialCategory-name">
                                            {materialCategory.name}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="materialCategory-description">
                                            {materialCategory.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <CategoryIcon />
                            <span className="materialCategory-name">
                                {materialCategory.name}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="materialCategory-description">
                                {trimText(materialCategory.description, 40)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredMaterialCategories && isQueryFound ? filteredMaterialCategories.map((materialCategory, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card materialCategory"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog materialCategory">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                <div>
                                    <CategoryIcon />
                                    <span className="materialCategory-name">
                                        {highlightMatch(materialCategory.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="materialCategory-description">
                                        {highlightMatch(materialCategory.description, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                            <div>
                                <CategoryIcon />
                                <span className="materialCategory-name">
                                    {highlightMatch(materialCategory.name, query)}
                                </span>
                            </div>
                            <div>
                                <DescriptionIcon />
                                <span className="materialCategory-description">
                                    {highlightMatch(trimText(materialCategory.description, 40), query)}
                                </span>
                            </div>
                      </Paper>
                    </Grid>
                  )) : ""
                  }
                </Grid>
                </Box>
                 : (
                    <div className='progress-container'>
                         {t('NO_MATERIAL_CATEGORY_AVAILABLE')}
                    </div>
                )}

                {
                    materialCategories.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalUsers / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }

            </div>

        </div>
    )
}

export default MaterialCategories;
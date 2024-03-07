import '../../../components/Departments.css'
import './Warehouses.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AddWarehouse from './AddWarehouse';
import StorageIcon from '@mui/icons-material/Storage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';




function Warehouses() {

    const { t, i18n } = useTranslation('warehousesPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const [filteredWarehouses, setFilteredWarehouses] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
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
        for (let i = 0; i < warehouses.length; i++) {
            if (Object.values(warehouses[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (warehouses.length > 0 && isQueryFound) {
            const filtered = warehouses.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredWarehouses(filtered);
        }
    }, [warehouses, query, isQueryFound]);

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "warehouse",
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedWarehouses = res.data.map(warehouse => ({
                    id: warehouse.Id,
                    name: warehouse.WarehouseName,
                    location: warehouse.Location,
                    capacity: warehouse.Capacity,
                    manager: {
                        id: warehouse.ManagerId,
                        name: `${capitalizeFirstLetter(warehouse.Manager.Firstname)} ${capitalizeFirstLetter(warehouse.Manager.Lastname)}`
                    }
                }));
                setWarehouses(formattedWarehouses);
                setIsQueryFound(formattedWarehouses.length > 0);
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

    useEffect(() => {
        async function getWarehouses() {
            try {
                setIsLoading(true)
                const res = await jwtService.getItems({
                    itemType: "warehouse",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    const formattedWarehouses = res.data.warehouses.map(warehouse => ({
                        id: warehouse.Id,
                        name: warehouse.WarehouseName,
                        location: warehouse.Location,
                        capacity: warehouse.Capacity,
                        manager: {
                            id: warehouse.ManagerId,
                            name: `${capitalizeFirstLetter(warehouse.Manager.Firstname)} ${capitalizeFirstLetter(warehouse.Manager.Lastname)}`
                        }
                    }))
                    setTotalUsers(res.data.count)
                    setWarehouses(formattedWarehouses)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getWarehouses();
    }, []);


    function handleAddingWarehouse() {
        dispatch(openDialog({
            children: ( 
                <AddWarehouse wrhouse={false} />
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
                    <AddWarehouse wrhouse={warehouses[i]} />
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
                    <Delete itemId={warehouses[i].id} 
                    itemType="warehouse" />
                )
            }));
        }, 100);
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
                <button id="btn-generic" className="add-btn" onClick={handleAddingWarehouse}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_WAREHOUSE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)}
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_WAREHOUSES')}
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
                {isLoading ? (
                    <div className='progress-container'>
                        <CircularProgress />
                    </div>
                ) : warehouses.length > 0 ? 
                    <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {warehouses.length > 0 && !isQueryFound ? warehouses.map((warehouse, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card warehouse"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog warehouse">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="paper-container">
                                        <div>
                                            <BusinessIcon /> 
                                            <span className="warehouse-name">
                                                {warehouse.name}
                                            </span>
                                        </div>
                                        <div>
                                            <PersonIcon />
                                            <span className="warehouse-manager">
                                                {warehouse.manager.name}
                                            </span>
                                        </div>
                                        <div>
                                            <LocationOnIcon />
                                            <span className="warehouse-location">
                                                {warehouse.location}
                                            </span>
                                        </div>
                                        <div>
                                            <StorageIcon /> 
                                            <span className="warehouse-location">
                                                {warehouse.capacity}
                                            </span>
                                        </div>
                                    </div>      
                                </div>
                            )
                        }))
                      }}
                    >   <div className='paper-container'>
                            <div>
                                <BusinessIcon /> 
                                <span className="warehouse-name">
                                    {warehouse.name}
                                </span>
                            </div>
                            <div>
                                <PersonIcon />
                                <span className="warehouse-manager">
                                    {warehouse.manager.name}
                                </span>
                            </div>
                            <div>
                                <LocationOnIcon />
                                <span className="warehouse-location">
                                    {warehouse.location}
                                </span>
                            </div>
                            <div>
                                <StorageIcon /> 
                                <span className="warehouse-location">
                                    {warehouse.capacity}
                                </span>
                            </div>
                        </div>    
                      </Paper>
                    </Grid>
                  )) : filteredWarehouses && isQueryFound ? filteredWarehouses.map((warehouse, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card warehouse"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog warehouse">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className='paper-container'>
                                        <div>
                                            <BusinessIcon /> 
                                            <span className="warehouse-name">
                                                {highlightMatch(warehouse.name, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <PersonIcon />
                                            <span className="warehouse-manager">
                                                {highlightMatch(warehouse.manager.name, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <LocationOnIcon />
                                            <span className="warehouse-location">
                                                {highlightMatch(warehouse.location, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <StorageIcon /> 
                                            <span className="warehouse-location">
                                                {highlightMatch(warehouse.capacity, query)}
                                            </span>
                                        </div>
                                    </div>    
                                </div>
                            )
                        }))
                      }}
                    >
                    <div className='paper-container'>
                        <div>
                            <BusinessIcon /> 
                            <span className="warehouse-name">
                                {highlightMatch(warehouse.name, query)}
                            </span>
                        </div>
                        <div>
                            <PersonIcon />
                            <span className="warehouse-manager">
                                {highlightMatch(warehouse.manager.name, query)}
                            </span>
                        </div>
                        <div>
                            <LocationOnIcon />
                            <span className="warehouse-location">
                                {highlightMatch(warehouse.location, query)}
                            </span>
                        </div>
                        <div>
                            <StorageIcon /> 
                            <span className="warehouse-location">
                                {highlightMatch(warehouse.capacity, query)}
                            </span>
                        </div>
                    </div>    
                      </Paper>
                    </Grid>
                  )) : ""
                  }
                </Grid>
                    </Box>
                 : (
                    <div className='progress-container'>
                        {t('NO_WAREHOUSES_AVAILABLE')}
                    </div>
                )}

                {
                    warehouses.length > 0 ?
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

export default Warehouses;
import '../../../components/Departments.css'
import './Warehouses.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AddWarehouse from './AddWarehouse';
import StorageIcon from '@mui/icons-material/Storage';



function Warehouses() {

    const [filteredWarehouses, setFilteredWarehouses] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
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


    useEffect(() => {
        // get the Userments from the backend
        async function getWarehouses() {
            try {
                const response = await axios.get('http://localhost:3050/warehouses');
                console.log('The response', response)
                const warehousesArr = response.data.warehouses;
                setWarehouses(warehousesArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getWarehouses();
    }, []);


    function handleAddingWarehouse() {
        dispatch(openDialog({
            children: ( 
                <AddWarehouse />
            )
        }))
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingWarehouse}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Warehouse</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search warehouses" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
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
                                                {warehouse.manager}
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
                                    {warehouse.manager}
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
                                                {highlightMatch(warehouse.manager, query)}
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
                                {highlightMatch(warehouse.manager, query)}
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
                  )) : <div>Loading...</div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default Warehouses;
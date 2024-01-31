import '../../Departments.css'
import './Suppliers.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AddSupplier from './AddSupplier';



function Suppliers() {

    const [filteredSuppliers, setFilteredSuppliers] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
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
        for (let i = 0; i < suppliers.length; i++) {
            if (Object.values(suppliers[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (suppliers.length > 0 && isQueryFound) {
            const filtered = suppliers.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredSuppliers(filtered);
        }
    }, [suppliers, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getSuppliers() {
            try {
                const response = await axios.get('http://localhost:3050/suppliers');
                console.log('The response', response)
                const suppliersArr = response.data.suppliers;
                setSuppliers(suppliersArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getSuppliers();
    }, []);


    function handleAddingSupplier() {
        dispatch(openDialog({
            children: ( 
                <AddSupplier />
            )
        }))
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingSupplier}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Supplier</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Suppliers" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {suppliers.length > 0 && !isQueryFound ? suppliers.map((supplier, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card supplier"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog supplier">
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="supplier-name">
                                            {supplier.name}
                                        </span>
                                    </div>
                                    <div>
                                        <LocationOnIcon />
                                        <span className="supplier-location">
                                            {supplier.address}
                                        </span>
                                    </div>
                                    <div>
                                        <PhoneIcon />
                                        <span className="supplier-phone">
                                            {supplier.contactInfo.phone}
                                        </span>
                                    </div>
                                    <div>
                                        <EmailIcon /> 
                                        <span className="supplier-email">
                                            {supplier.contactInfo.email}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                            <div>
                                <BusinessIcon /> 
                                <span className="supplier-name">
                                    {supplier.name}
                                </span>
                            </div>
                            <div>
                                <LocationOnIcon />
                                <span className="supplier-location">
                                    {supplier.address}
                                </span>
                            </div>
                            <div>
                                <PhoneIcon />
                                <span className="supplier-phone">
                                    {supplier.contactInfo.phone}
                                </span>
                            </div>
                            <div>
                                <EmailIcon /> 
                                <span className="supplier-email">
                                    {supplier.contactInfo.email}
                                </span>
                            </div>
                      </Paper>
                    </Grid>
                  )) : filteredSuppliers && isQueryFound ? filteredSuppliers.map((supplier, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card supplier"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog supplier">
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="supplier-name">
                                            {highlightMatch(supplier.name, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <LocationOnIcon />
                                        <span className="supplier-location">
                                            {highlightMatch(supplier.address, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PhoneIcon />
                                        <span className="supplier-phone">
                                            {highlightMatch(supplier.contactInfo.phone, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <EmailIcon /> 
                                        <span className="supplier-email">
                                            {highlightMatch(supplier.contactInfo.email, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <BusinessIcon /> 
                            <span className="supplier-name">
                                {highlightMatch(supplier.name, query)}
                            </span>
                        </div>
                        <div>
                            <LocationOnIcon />
                            <span className="supplier-location">
                                {highlightMatch(supplier.address, query)}
                            </span>
                        </div>
                        <div>
                            <PhoneIcon />
                            <span className="supplier-phone">
                                {highlightMatch(supplier.contactInfo.phone, query)}
                            </span>
                        </div>
                        <div>
                            <EmailIcon /> 
                            <span className="supplier-email">
                                {highlightMatch(supplier.contactInfo.email, query)}
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

export default Suppliers;
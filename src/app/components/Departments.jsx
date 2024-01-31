import './Departments.css';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import AddDepartment from './AddDepartment'


function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}

function Departments() {

    // handling search and expansion

    const [filteredDeparts, setFilteredDeparts] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [departs, setDeparts] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {

        if (!isQueryFound) {
            return text
        }

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
        for (let i = 0; i < departs.length; i++) {
            if (Object.values(departs[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (departs.length > 0 && isQueryFound) {
            const filtered = departs.filter((depart) => {
                // Check if any field in the department matches the query
                return Object.values(depart).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
            console.log('The filtered departments', filtered)
    
            setFilteredDeparts(filtered);
        }
    }, [departs, query, isQueryFound]);


    useEffect(() => {
        // get the departments from the backend
        async function getDepartments() {
            try {
                const response = await axios.get('http://localhost:3050/departments');
                const dprtsArr = response.data.departments;
                setDeparts(dprtsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getDepartments();
    }, []);


    // handling adding a department

    function handleAddingDepart() {
        dispatch(openDialog({
            children: ( 
                <AddDepartment />
            )
        }))
    }



    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingDepart}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Department</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Departments" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>   

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {departs.length > 0 && !isQueryFound ? departs.map((depart, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog">
                                    <div className="head-container">
                                         <img src={`/assets/gen/${depart.category === 'Production' ? 'production' : 'briefcase'}.svg`} />
                                         <span className="category">
                                            {depart.category}
                                         </span>
                                         <span className="name">
                                            {depart.name}
                                         </span>
                                     </div>
                                     <div className="body-container">
                                            <div className="manager">
                                                <span>
                                                   {depart.manager}
                                                </span>
                                            </div>
                                            <div className="description">
                                               {depart.description}
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img src={`/assets/gen/${depart.category === "Production" ? 'production' : 'briefcase'}.svg`} />
                            <span className="category">
                                {depart.category}
                            </span>
                            <span className="name">
                                {depart.name}
                            </span>
                        </div>
                        <div className="body-container">
                            <div className="manager">
                                <span>
                                    {depart.manager}
                                </span>
                            </div>
                            <div className="description">
                                {trimText(depart.description, 55)}
                            </div>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredDeparts && isQueryFound ? filteredDeparts.map((depart, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog">
                                    <div className="head-container">
                                         <img src={`/assets/gen/${depart.category === "Production" ? 'production' : 'briefcase'}.svg`} />
                                         <span className="category">
                                            {highlightMatch(depart.category, query)}
                                         </span>
                                         <span className="name">
                                            {highlightMatch(depart.name, query)}
                                         </span>
                                     </div>
                                     <div className="body-container">
                                            <div className="manager">
                                                <span>
                                                   {highlightMatch(depart.manager, query)}
                                                </span>
                                            </div>
                                            <div className="description">
                                               {highlightMatch(depart.description, query)}
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img src={`/assets/gen/${depart.category === "Production" ? 'production' : 'briefcase'}.svg`} />
                            <span className="category">
                                {highlightMatch(depart.category, query)}
                            </span>
                            <span className="name">
                                {highlightMatch(depart.name, query)}
                            </span>
                        </div>
                        <div className="body-container">
                            <div className="manager">
                                <span>
                                    {highlightMatch(depart.manager, query)}
                                </span>
                            </div>
                            <div className="description">
                                {highlightMatch(depart.description, query)}
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

export default Departments;

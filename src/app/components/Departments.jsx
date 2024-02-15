import './Departments.css';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import AddDepartment from './AddDepartment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from './Delete';


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
                <AddDepartment dprt={false} />
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
                    <AddDepartment dprt={departs[i]} />
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
                children: ( 
                    <Delete itemId={i} itemType='department' />
                )
            }));
        }, 100);
    }




    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingDepart}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Department</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Departments" type="search" />
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
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                {trimText(depart.description, 35)}
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
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                {highlightMatch(trimText(depart.description, 35), query)}
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

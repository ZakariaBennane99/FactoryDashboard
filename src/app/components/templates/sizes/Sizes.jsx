import '../../../components/Departments.css'
import './Sizes.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddSize from './AddSize';
import HeightIcon from '@mui/icons-material/Height';
import CategoryIcon from '@mui/icons-material/Category';
import RulerIcon from '@mui/icons-material/Straighten'; 
import ExtensionIcon from '@mui/icons-material/Extension';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ScissorsIcon from '@mui/icons-material/ContentCut'; 
import ScaleIcon from '@mui/icons-material/Scale'
import CheckroomIcon from '@mui/icons-material/Checkroom';


function Sizes() {

    const [filteredSizes, setFilteredSizes] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [sizes, setMaterials] = useState([]);
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
        for (let i = 0; i < sizes.length; i++) {
            if (Object.values(sizes[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (sizes.length > 0 && isQueryFound) {
            const filtered = sizes.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredSizes(filtered);
        }
    }, [sizes, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/template-sizes');
                console.log('The response', response)
                const materialsArr = response.data.sizes;
                setMaterials(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddSize sze={false} />
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
                    <AddSize sze={sizes[i]} />
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
                    <Delete itemId={i} />
                )
            }));
        }, 100);
    }

    function getIconByType(type) {
        switch (type) {
            case 'Cutting':
                return <ScissorsIcon />;
            case 'Dressup':
                return <CheckroomIcon />;
            default:
                return null;
        }
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Template Size</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Sizes" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {sizes.length > 0 && !isQueryFound ? sizes.map((size, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card size"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog size">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <HeightIcon /> 
                                        <span className="size">
                                            {size.size}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="template">
                                            {size.template}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon />
                                        <span className="measurement-name">
                                            {size.measurementName}
                                        </span>
                                    </div>
                                    <div>
                                        <NumbersIcon />
                                        <span className="measurement-value">
                                            {size.measurementValue}
                                        </span>
                                    </div>
                                    <div>
                                        <ScaleIcon />
                                        <span className="measurement-unit">
                                            {size.measurementUnit}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon /> 
                                        <span className="description">
                                            {size.description}
                                        </span>
                                    </div>
                                    <div>
                                        {getIconByType(size.templateSizeType)}
                                        <span className="measurement-size-type">
                                            {size.templateSizeType}
                                        </span>
                                    </div>
                                    {
                                        size.components.length > 0 ? 
                                        <div>
                                            <ExtensionIcon />
                                            <div className="component">
                                                {size.components.length} {size.components.length > 1 ? 'Components' : 'Component'} 
                                            </div>
                                        </div> : ''
                                    }
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <HeightIcon /> 
                            <span className="size">
                                {size.size}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="template">
                                {size.template}
                            </span>
                        </div>
                        <div>
                            <RulerIcon />
                            <span className="measurement-name">
                                {size.measurementName}
                            </span>
                        </div>
                        <div>
                            <NumbersIcon />
                            <span className="measurement-value">
                                {size.measurementValue}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredSizes && isQueryFound ? filteredSizes.map((size, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card size"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog size">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <HeightIcon /> 
                                        <span className="size">
                                            {highlightMatch(size.size, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="template">
                                            {highlightMatch(size.template, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon />
                                        <span className="measurement-name">
                                            {highlightMatch(size.measurementName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <NumbersIcon />
                                        <span className="measurement-value">
                                            {highlightMatch(size.measurementValue, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <ScaleIcon />
                                        <span className="measurement-unit">
                                            {highlightMatch(size.measurementUnit, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon /> 
                                        <span className="description">
                                            {highlightMatch(size.description, query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getIconByType(size.templateSizeType)}
                                        <span className="measurement-size-type">
                                            {highlightMatch(size.templateSizeType, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <HeightIcon /> 
                            <span className="size">
                                {highlightMatch(size.size, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="template">
                                {highlightMatch(size.template, query)}
                            </span>
                        </div>
                        <div>
                            <RulerIcon />
                            <span className="measurement-name">
                                {highlightMatch(size.measurementName, query)}
                            </span>
                        </div>
                        <div>
                            <NumbersIcon />
                            <span className="measurement-value">
                                {highlightMatch(size.measurementValue, query)}
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

export default Sizes;
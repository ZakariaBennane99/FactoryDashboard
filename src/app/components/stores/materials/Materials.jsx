import '../../Departments.css'
import './Materials.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';
import tinycolor from 'tinycolor2';
import AddMaterial from './AddMaterial';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReportDate from './ReportDates'



function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Materials() {

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materials, setMaterials] = useState([]);
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
        for (let i = 0; i < materials.length; i++) {
            if (Object.values(materials[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (materials.length > 0 && isQueryFound) {
            const filtered = materials.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterials(filtered);
        }
    }, [materials, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/materials');
                console.log('The response', response)
                const materialsArr = response.data.materials;
                setMaterials(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingMaterial() {
        dispatch(openDialog({
            children: ( 
                <AddMaterial mtrl={false} />
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
                    <AddMaterial mtrl={materials[i]} />
                )
            }));
        }, 100);
    }

    function handleReports(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <ReportDate materialId={i} />
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

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingMaterial}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Material</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Materials" type="search" />
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {materials.length > 0 && !isQueryFound ? materials.map((material, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card material"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog material">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <AccountTreeIcon id="material-reports" onClick={() => handleReports(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <TextSnippetIcon />
                                        <span className="material-name">
                                            {material.name}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="material-type">
                                            {material.type}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon />
                                        <span className="material-color" style={{ 
                                            backgroundColor: material.color.toLocaleLowerCase(), 
                                            color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                            {material.color}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="material-description">
                                            {material.description}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="material-supplier">
                                            {material.supplier}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <TextSnippetIcon />
                            <span className="material-name">
                                {material.name}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon />
                            <span className="material-type">
                                {material.type}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon />
                            <span className="material-color" style={{ 
                                backgroundColor: material.color.toLocaleLowerCase(), 
                                color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                {material.color}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="material-description">
                                {trimText(material.description, 40)}
                            </span>
                        </div>
                        <div>
                            <BusinessIcon /> 
                            <span className="material-supplier">
                                {material.supplier}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredMaterials && isQueryFound ? filteredMaterials.map((material, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card material"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog material">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />

                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                <div>
                                    <TextSnippetIcon />
                                    <span className="material-name">
                                        {highlightMatch(material.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <CategoryIcon />
                                    <span className="material-type">
                                        {highlightMatch(material.type, query)}
                                    </span>
                                </div>
                                <div>
                                    <PaletteIcon />
                                    <span className="material-color" style={{ 
                                        backgroundColor: material.color.toLocaleLowerCase(), 
                                        color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                        {highlightMatch(material.color, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="material-description">
                                        {highlightMatch(material.description, query)}
                                    </span>
                                </div>
                                <div>
                                    <BusinessIcon /> 
                                    <span className="material-supplier">
                                        {highlightMatch(material.supplier, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                            <div>
                                <TextSnippetIcon />
                                <span className="material-name">
                                    {highlightMatch(material.name, query)}
                                </span>
                            </div>
                            <div>
                                <CategoryIcon />
                                <span className="material-type">
                                    {highlightMatch(material.type, query)}
                                </span>
                            </div>
                            <div>
                                <PaletteIcon />
                                <span className="material-color" style={{ 
                                    backgroundColor: material.color.toLocaleLowerCase(), 
                                    color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                    {highlightMatch(material.color, query)}
                                </span>
                            </div>
                            <div>
                                <DescriptionIcon />
                                <span className="material-description">
                                    {highlightMatch(trimText(material.description, 40), query)}
                                </span>
                            </div>
                            <div>
                                <BusinessIcon /> 
                                <span className="material-supplier">
                                    {highlightMatch(material.supplier, query)}
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

export default Materials;
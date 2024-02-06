import './Details.css';
import '../../Departments.css'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import AddDetail from './AddDetail';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import TextureIcon from '@mui/icons-material/Texture';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Winter
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // summer
import FilterDramaIcon from '@mui/icons-material/FilterDrama'; // autumn
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Spring


function Details() {

    // handling search and expansion

    const [filteredDetails, setFilteredDetails] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [details, setDetails] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span id="not-applied">{text}</span>;
        }
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Replace matches in the text with a highlighted span
        const highlightedText = text.replace(regex, (match) => `<span id="not-applied" class="highlight">${match}</span>`);
    
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    }

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < details.length; i++) {
            if (Object.values(details[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (details.length > 0 && isQueryFound) {
            const filtered = details.filter((detail) => {
                // Check if any field in the Detail matches the query
                return Object.values(detail).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
            console.log('The filtered details', filtered)
    
            setFilteredDetails(filtered);
        }
    }, [details, query, isQueryFound]);


    useEffect(() => {
        // get the details from the backend
        async function getDetails() {
            try {
                const response = await axios.get('http://localhost:3050/product-catalogue-details');
                const dprtsArr = response.data.details;
                setDetails(dprtsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getDetails();
    }, []);


    // handling adding a Detail

    function handleAddingDepart() {
        dispatch(openDialog({
            children: ( 
                <AddDetail dtl={false} />
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
                    <AddDetail dtl={details[i]} />
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


    function getSeasonIcon(season) {
        switch (season.toLowerCase()) {
            case 'winter':
                return <AcUnitIcon />;
            case 'summer':
                return <WbSunnyIcon />;
            case 'autumn':
                return <FilterDramaIcon />;
            case 'fall':
                return <FilterDramaIcon />;
            case 'spring':
                return <LocalFloristIcon />;
            default:
                return null;
        }
    }



    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingDepart}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Detail</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Details" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>   

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {details.length > 0 && !isQueryFound ? details.map((detail, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="detail-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="detail-card dialog">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="body-container">
                                        <div className="cat1">
                                            <CategoryIcon />
                                            <span>
                                                {detail.Category1}
                                            </span>
                                        </div>
                                        <div className="template-type">
                                            <CategoryIcon />
                                            <span>
                                                {detail.TemplateType}
                                            </span>
                                        </div>
                                        <div className="cat2">
                                            <LayersIcon />
                                            <span>
                                                {detail.Category2}
                                            </span>
                                        </div>
                                        <div className="description">
                                            <DescriptionIcon />
                                            <span>{detail.Description}</span>
                                        </div>
                                            <div className="detail">
                                                {getSeasonIcon(detail.Season)}
                                                <span>{detail.Season}</span>
                                            </div>
                                            <div className="textile">
                                                <TextureIcon />
                                                <span>{detail.Textile}</span>
                                            </div>
                                            <div className="pattern">
                                                <FormatColorFillIcon />
                                                <span>{detail.TemplatePattern}</span>
                                            </div>
                                            <div className="weight">
                                                <FitnessCenterIcon />
                                                <span>{detail.StandardWeight}g</span>
                                            </div>
                                            <div className="grammage">
                                                <span className="txt-identifier">Grammage:</span>
                                                <span>{detail.Grammage} g/m²</span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="body-container">
                            <div className="template-type">
                                <CategoryIcon />
                                <span>
                                    {detail.TemplateType}
                                </span>
                            </div>
                                <div className="detail">
                                    {getSeasonIcon(detail.Season)}
                                    <span>{detail.Season}</span>
                                </div>
                                <div className="textile">
                                    <TextureIcon />
                                    <span>{detail.Textile}</span>
                                </div>
                                <div className="pattern">
                                    <FormatColorFillIcon />
                                    <span>{detail.TemplatePattern}</span>
                                </div>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredDetails && isQueryFound ? filteredDetails.map((detail, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="detail-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="detail-card dialog">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="body-container">
                                        <div className="cat1">
                                            <CategoryIcon />
                                            <span>
                                                {highlightMatch(detail.Category1, query)}
                                            </span>
                                        </div>
                                        <div className="template-type">
                                            <CategoryIcon />
                                            <span>
                                                {highlightMatch(detail.TemplateType, query)}
                                            </span>
                                        </div>
                                        <div className="cat2">
                                            <LayersIcon />
                                            <span>
                                                {highlightMatch(detail.Category2, query)}
                                            </span>
                                        </div>
                                        <div className="description">
                                            <DescriptionIcon />
                                            <span>
                                                {highlightMatch(detail.Description, query)}
                                            </span>
                                        </div>
                                            <div className="detail">
                                                {getSeasonIcon(detail.Season)}
                                                <span>{highlightMatch(detail.Season, query)}</span>
                                            </div>
                                            <div className="textile">
                                                <TextureIcon />
                                                <span>{highlightMatch(detail.Textile, query)}</span>
                                            </div>
                                            <div className="pattern">
                                                <FormatColorFillIcon />
                                                <span>{highlightMatch(detail.TemplatePattern, query)}</span>
                                            </div>
                                            <div className="weight">
                                                <FitnessCenterIcon />
                                                <span>{highlightMatch(`${detail.StandardWeight}g`, query)}</span>
                                            </div>
                                            <div className="grammage">
                                                <span className="txt-identifier">Grammage: </span>
                                                <span>{highlightMatch(`${detail.Grammage} g/m²`, query)}</span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="body-container">
                            <div className="template-type">
                                <CategoryIcon />
                                <span>
                                    {highlightMatch(detail.TemplateType, query)}
                                </span>
                            </div>
                                <div className="detail">
                                    {getSeasonIcon(detail.Season)}
                                    <span>{highlightMatch(detail.Season, query)}</span>
                                </div>
                                <div className="textile">
                                    <TextureIcon />
                                    <span>{highlightMatch(detail.Textile, query)}</span>
                                </div>
                                <div className="pattern">
                                    <FormatColorFillIcon />
                                    <span>{highlightMatch(detail.TemplatePattern, query)}</span>
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

export default Details;

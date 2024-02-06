import '../../Departments.css'
import './Seasons.css'
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import AddSeason from './AddSeason';
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Winter
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // summer
import FilterDramaIcon from '@mui/icons-material/FilterDrama'; // autumn
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Spring
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';

function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Seasons() {

    const [filteredSeasons, setFilteredSeasons] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [seasons, setMaterials] = useState([]);
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
        for (let i = 0; i < seasons.length; i++) {
            if (Object.values(seasons[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (seasons.length > 0 && isQueryFound) {
            const filtered = seasons.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredSeasons(filtered);
        }
    }, [seasons, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/product-catalogue-seasons');
                console.log('The response', response)
                const materialsArr = response.data.seasons;
                setMaterials(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingSeason() {
        dispatch(openDialog({
            children: ( 
                <AddSeason seasn={false} />
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
                    <AddSeason seasn={seasons[i]} />
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
                <button className="add-btn" onClick={handleAddingSeason}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Season</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Seasons" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {seasons.length > 0 && !isQueryFound ? seasons.map((season, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="season-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="dialog">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="season">
                                        {getSeasonIcon(season.seasonName)}
                                        <span>
                                            {season.seasonName}
                                        </span>
                                    </div>
                                    <div className="start-date">
                                        <TodayIcon />
                                        <span>
                                            {season.startDate}
                                        </span>
                                    </div>
                                    <div className="end-date">
                                        <EventIcon />
                                        <span>
                                            {season.endDate}
                                        </span>
                                    </div>
                                    <div className="description">
                                        <DescriptionIcon />
                                        <span>{season.description}</span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="season">
                            {getSeasonIcon(season.seasonName)}
                            <span>
                                {season.seasonName}
                            </span>
                        </div>
                        <div className="start-date">
                            <TodayIcon />
                            <span>
                                {season.startDate}
                            </span>
                        </div>
                        <div className="end-date">
                            <EventIcon />
                            <span>
                                {season.endDate}
                            </span>
                        </div>
                        <div className="description">
                            <DescriptionIcon />
                            <span>{trimText(season.description, 35)}</span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredSeasons && isQueryFound ? filteredSeasons.map((season, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="season-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="dialog">
                                <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div className="season">
                                    {getSeasonIcon(season.seasonName)}
                                    <span>
                                        {highlightMatch(season.seasonName, query)}
                                    </span>
                                </div>
                                <div className="start-date">
                                    <TodayIcon />
                                    <span>
                                        {highlightMatch(season.startDate, query)}
                                    </span>
                                </div>
                                <div className="end-date">
                                    <EventIcon />
                                    <span>
                                        {highlightMatch(season.endDate, query)}
                                    </span>
                                </div>
                                <div className="description">
                                    <DescriptionIcon />
                                    <span>{highlightMatch(season.description, query)}</span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div className="season">
                            {getSeasonIcon(season.seasonName)}
                            <span>
                                {highlightMatch(season.seasonName, query)}
                            </span>
                        </div>
                        <div className="start-date">
                            <TodayIcon />
                            <span>
                                {highlightMatch(season.startDate, query)}
                            </span>
                        </div>
                        <div className="end-date">
                            <EventIcon />
                            <span>
                                {highlightMatch(season.endDate, query)}
                            </span>
                        </div>
                        <div className="description">
                            <DescriptionIcon />
                            <span>{highlightMatch(trimText(season.description, 35), query)}</span>
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

export default Seasons;
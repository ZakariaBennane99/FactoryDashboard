import '../../Departments.css'
import './Seasons.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
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
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}


function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Seasons() {

    const { t, i18n } = useTranslation('seasonsPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredSeasons, setFilteredSeasons] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [seasons, setSeasons] = useState([]);
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
        async function getSeasons() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "season",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    const formatted = res.data.seasons.map(ctgr => ({ 
                        id: ctgr.Id,
                        seasonName: ctgr.SeasonName,
                        startDate: ctgr.StartDate,
                        endDate: ctgr.EndDate,
                        description: ctgr.Description
                    }));
                    setTotalCtlgs(res.data.count)
                    setSeasons(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getSeasons();
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
                    <Delete itemId={seasons[i].id} itemType='season' />
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

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "season", // Adjusted to target seasons
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
              
                const formattedSeasons = res.data.map(season => ({ // Adjusted for seasons
                    id: season.Id,
                    seasonName: season.SeasonName,
                    startDate: season.StartDate,
                    endDate: season.EndDate,
                    description: season.Description
                }));
                setSeasons(formattedSeasons); // Adjusted to setSeasons
                setIsQueryFound(formattedSeasons.length > 0); 
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



    return (
        <div className="parent-container">

            <div className="top-ribbon">
    
                <button id="btn-generic" className="add-btn" onClick={handleAddingSeason}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_SEASON')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    label={t('SEARCH_SEASONS')} type="search"
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button>

            </div>  

            <div className="main-content">
            {
                    isLoading ?
                    (
                        <div className='progress-container'>
                            <CircularProgress />
                        </div>
                    ) 
                     : seasons.length > 0 ? 
                     (

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
                                                    {formatDate(season.startDate)}
                                                </span>
                                            </div>
                                            <div className="end-date">
                                                <EventIcon />
                                                <span>
                                                    {formatDate(season.endDate)}
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
                                        {formatDate(season.startDate)}
                                    </span>
                                </div>
                                <div className="end-date">
                                    <EventIcon />
                                    <span>
                                        {formatDate(season.endDate)}
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
                                                {highlightMatch(formatDate(season.startDate), query)}
                                            </span>
                                        </div>
                                        <div className="end-date">
                                            <EventIcon />
                                            <span>
                                                {highlightMatch(formatDate(season.endDate), query)}
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
                                        {highlightMatch(formatDate(season.startDate), query)}
                                    </span>
                                </div>
                                <div className="end-date">
                                    <EventIcon />
                                    <span>
                                        {highlightMatch(formatDate(season.endDate), query)}
                                    </span>
                                </div>
                                <div className="description">
                                    <DescriptionIcon />
                                    <span>{highlightMatch(trimText(season.description, 35), query)}</span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : ""
                          }
                        </Grid>
                    </Box>
                     ) : (
                        <div className='progress-container'>
                            {t('NO_SEASON_AVAILABLE')}
                        </div>
                    )
                }
                {
                    seasons.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalCtlgs / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }
            </div>

        </div>
    )
}

export default Seasons;
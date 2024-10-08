import '../../../components/Departments.css'
import './ManufacturingStages.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddManufacturingStage from './AddManufacturingStage';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import InfoIcon from '@mui/icons-material/Info';
import LayersIcon from '@mui/icons-material/Layers';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TimelineIcon from '@mui/icons-material/Timeline';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next';




function ManufacturingStages() {

    const { t, i18n } = useTranslation('manufacturingStagesPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredTemplates, setFilteredTemplates] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [manufacturingStages, setManufacturingStages] = useState([]);
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
        for (let i = 0; i < manufacturingStages.length; i++) {
            if (Object.values(manufacturingStages[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
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

    useEffect(() => {
        if (manufacturingStages.length > 0 && isQueryFound) {
            const filtered = manufacturingStages.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTemplates(filtered);
        }
    }, [manufacturingStages, query, isQueryFound]);


    useEffect(() => {
        async function getManufacturingStages() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "manufacturingstage",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    const formatted = res.data.stages.map(ctgr => ({ 
                        id: ctgr.Id,
                        stageNumber: ctgr.StageNumber,
                        stageName: ctgr.StageName,
                        workDescription: ctgr.WorkDescription,
                        duration: ctgr.Duration,
                        description: ctgr.Description,
                        template: ctgr.Template,
                        department: ctgr.Department
                    }));
                    console.log('The formatted', formatted)
                    setTotalCtlgs(res.data.count)
                    setManufacturingStages(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getManufacturingStages();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddManufacturingStage mnfStage={false} />
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
                    <AddManufacturingStage mnfStage={manufacturingStages[i]} />
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
                    <Delete itemId={manufacturingStages[i].id} itemType="manufacturingstage" />
                )
            }));
        }, 100);
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "manufacturingstage", // Adapted to search for manufacturing stages
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedStages = res.data.map(stage => ({
                    id: stage.Id,
                    stageNumber: stage.StageNumber,
                    stageName: stage.StageName,
                    workDescription: stage.WorkDescription,
                    duration: stage.Duration,
                    description: stage.Description,
                    template: stage.Template,
                    department: stage.Department
                }));
                setManufacturingStages(formattedStages); // Adapted to set manufacturing stages
                setIsQueryFound(formattedStages.length > 0);
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

                <button id="btn-generic" className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>{t('ADD_MANUFACTURING_STAGE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_MANUFACTURING_STAGES')}
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
            {
                    isLoading ?
                    (
                        <div className='progress-container'>
                            <CircularProgress />
                        </div>
                    ) 
                     : manufacturingStages.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {manufacturingStages.length > 0 && !isQueryFound ? manufacturingStages.map((manufacturingStage, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card manufacturingStage"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog manufacturingStage">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <LabelIcon /> 
                                                <span className="manufacturingStage-name">
                                                    {manufacturingStage.stageName}
                                                </span>
                                            </div>
                                            <div>
                                                <TimelineIcon />
                                                <span className="manufacturingStage-number">
                                                    {manufacturingStage.stageNumber}
                                                </span>
                                            </div>
                                            <div>
                                                <AssignmentIcon /> 
                                                <span className="manufacturingStage-workDescription">
                                                    {manufacturingStage.workDescription}
                                                </span>
                                            </div>
                                            <div>
                                                <TimerIcon /> 
                                                <span className="manufacturingStage-duration">
                                                    {manufacturingStage.duration} Min
                                                </span>
                                            </div>
                                            <div>
                                                <InfoIcon /> 
                                                <span className="manufacturingStage-description">
                                                    {manufacturingStage.description}
                                                </span>
                                            </div>
                                            <div>
                                                <LayersIcon />
                                                <span className="manufacturingStage-template">
                                                    {manufacturingStage.template.TemplateName}
                                                </span>
                                            </div>
                                            <div>
                                                <BusinessCenterIcon />
                                                <span className="manufacturingStage-department">
                                                    {manufacturingStage.department.Name}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <LabelIcon /> 
                                    <span className="manufacturingStage-name">
                                        {manufacturingStage.stageName}
                                    </span>
                                </div>
                                <div>
                                    <TimerIcon /> 
                                    <span className="manufacturingStage-duration">
                                        {manufacturingStage.duration} Min
                                    </span>
                                </div>
                                <div>
                                    <LayersIcon />
                                    <span className="manufacturingStage-template">
                                        {manufacturingStage.template.TemplateName}
                                    </span>
                                </div>
                                <div>
                                    <BusinessCenterIcon />
                                    <span className="manufacturingStage-department">
                                        {manufacturingStage.department.Name}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredTemplates && isQueryFound ? filteredTemplates.map((manufacturingStage, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card manufacturingStage"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog manufacturingStage">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <LabelIcon /> 
                                                <span className="manufacturingStage-name">
                                                    {highlightMatch(manufacturingStage.stageName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <TimelineIcon />
                                                <span className="manufacturingStage-number">
                                                    {highlightMatch(manufacturingStage.stageNumber.toString(), query)}
                                                </span>
                                            </div>
                                            <div>
                                                <AssignmentIcon /> 
                                                <span className="manufacturingStage-workDescription">
                                                    {highlightMatch(manufacturingStage.workDescription, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <TimerIcon /> 
                                                <span className="manufacturingStage-duration">
                                                    {highlightMatch(manufacturingStage.duration, query)} Min
                                                </span>
                                            </div>
                                            <div>
                                                <InfoIcon /> 
                                                <span className="manufacturingStage-description">
                                                    {highlightMatch(manufacturingStage.description, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <LayersIcon />
                                                <span className="manufacturingStage-template">
                                                    {highlightMatch(manufacturingStage.template.TemplateName, query)}
                                                </span>
                                            </div>
                                            <div>
                                                <BusinessCenterIcon />
                                                <span className="manufacturingStage-department">
                                                    {highlightMatch(manufacturingStage.department.Name, query)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <LabelIcon /> 
                                    <span className="manufacturingStage-name">
                                        {highlightMatch(manufacturingStage.stageName, query)}
                                    </span>
                                </div>
                                <div>
                                    <TimerIcon /> 
                                    <span className="manufacturingStage-duration">
                                        {highlightMatch(manufacturingStage.duration, query)} Min
                                    </span>
                                </div>
                                <div>
                                    <LayersIcon />
                                    <span className="manufacturingStage-template">
                                        {highlightMatch(manufacturingStage.template.TemplateName, query)}
                                    </span>
                                </div>
                                <div>
                                    <BusinessCenterIcon />
                                    <span className="manufacturingStage-department">
                                        {highlightMatch(manufacturingStage.department.Name, query)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : ""
                          }
                        </Grid>
                    </Box>
                     ) : (
                        <div className='progress-container'>
                            {t('NO_MANUFACTURING_STAGE_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    manufacturingStages.length > 0 ?
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

export default ManufacturingStages;
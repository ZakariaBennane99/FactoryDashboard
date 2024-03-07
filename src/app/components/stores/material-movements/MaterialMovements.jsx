import '../../Departments.css'
import './MaterialMovements.css'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import OutboxIcon from '@mui/icons-material/Outbox';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoIcon from '@mui/icons-material/Info';
import AddMaterialMovement from './AddMaterialMovement';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTranslation } from 'react-i18next';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';





function MaterialMovements() {

    const { t, i18n } = useTranslation('materialMovementsPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materialMovements, setMaterialMovements] = useState([]);
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
        for (let i = 0; i < materialMovements.length; i++) {
            if (Object.values(materialMovements[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (materialMovements.length > 0 && isQueryFound) {
            const filtered = materialMovements.filter((user) => {
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterials(filtered);
        }
    }, [materialMovements, query, isQueryFound]);


    useEffect(() => {
        async function getMaterials() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "materialmovement"
                });
                if (res.status === 200) {
                    setMaterialMovements(res.data.updatedMaterialMovements)
                    setTotalUsers(res.data.count)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingMaterialMovement() {
        dispatch(openDialog({
            children: ( 
                <AddMaterialMovement mtrlMovement={null} />
            )
        }))
    }

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "materialmovement", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)

                setMaterialMovements(res.data.materialMovements); 
                setIsQueryFound(formattedMaterialMovements.length > 0);
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

    const getMovementIcon = (movementType) => {
        switch (movementType) {
            case 'INCOMING': return <MoveToInboxIcon />;
            case 'OUTGOING': return <OutboxIcon />;
            case 'TRANSFER': return <SwapHorizIcon />;
            case 'RETURN': return <ReplayIcon />;
            default: return <InfoIcon />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {            
            case 'REJECTED': return 'error';
            case 'APPROVED': return 'primary';
            case 'PENDING': return 'warning';
            case 'FULFILLED': return 'success';
            case 'CANCELLED': return 'default';
            case 'COMPLETED': return 'info';
            case 'ONGOING': return 'secondary';            
            default: return 'default';
        }
    };

    function handleEdit(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <AddMaterialMovement mtrlMovement={materialMovements[i]} />
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
                    <Delete itemId={materialMovements[i].id} itemType="materialmovement" />
                )
            }));
        }, 100);
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">

            <button id="btn-generic" className="add-btn" onClick={handleAddingMaterialMovement}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_MATERIAL_MOVEMENT')}</span>
                </button>

                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_MATERIAL_MOVEMENTS')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />

                <button id="btn-generic" 
                    className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`}
                    disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button> 

            </div>  

            <div className="main-content">
                {isLoading ? (
                    <div className='progress-container'>
                        <CircularProgress />
                    </div>
                ) : materialMovements.length > 0 ? 
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {materialMovements.length > 0 && !isQueryFound ? materialMovements.map((materialMovement, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card materialMovement"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog materialMovement">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                                    </div>
                                    <div>
                                        <TextSnippetIcon />
                                        <span className="materialMovement-name">
                                            {materialMovement.materialName.name}
                                        </span>
                                    </div>
                                    <div>
                                        <AssignmentIcon />
                                        <span className="materialMovement">
                                            {materialMovement.internalOrder.name}
                                        </span>
                                    </div>
                                    <div>
                                        {getMovementIcon(materialMovement.movementType)} 
                                        <span className="materialMovement-color">
                                            {materialMovement.movementType}
                                        </span>
                                    </div>
                                    <div>
                                        <StorefrontIcon />
                                        <span className="materialMovement-type">
                                            <span className="txt-identifiers">{t('FROM')}: </span> {materialMovement.from.name}  <span className="txt-identifiers">To: </span> {materialMovement.to.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="materialMovement-description">
                                            <span className="txt-identifiers">{t('QUANTITY')}:</span> {materialMovement.quantity} {materialMovement.unitOfMeasure}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="materialMovement-supplier">
                                            <span className="txt-identifiers">{t('NOTES')}:</span> {materialMovement.notes}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                        </div>
                        <div>
                            <TextSnippetIcon />
                            <span className="materialMovement-name">
                                {materialMovement.materialName.name}
                            </span>
                        </div>
                        <div>
                            {getMovementIcon(materialMovement.movementType)} 
                            <span className="materialMovement-color">
                                {materialMovement.movementType}
                            </span>
                        </div>
                        <div>
                            <StorefrontIcon />
                            <span className="materialMovement-type">
                                <span className="txt-identifiers">{t('FROM')}:</span> {materialMovement.from.name} <span className="txt-identifiers">To:</span> {materialMovement.name}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-description">
                                <span className="txt-identifiers">{t('QUANTITY')}:</span> {materialMovement.quantity} {materialMovement.unitOfMeasure}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-supplier">
                                <span className="txt-identifiers">{t('NOTES')}:</span> {materialMovement.notes}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredMaterials && isQueryFound ? filteredMaterials.map((materialMovement, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card materialMovement"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog materialMovement">
                                <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div>
                                    <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                                </div>
                                <div>
                                    <TextSnippetIcon />
                                    <span className="materialMovement-name">
                                        {highlightMatch(materialMovement.materialName.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <AssignmentIcon />
                                    <span className="materialMovement">
                                        {highlightMatch(materialMovement.internalOrder.name, query)}
                                    </span>
                                </div>
                                <div>
                                    {getMovementIcon(materialMovement.movementType)} 
                                    <span className="materialMovement-color">
                                        {highlightMatch(materialMovement.movementType, query)}
                                    </span>
                                </div>
                                <div>
                                    <StorefrontIcon />
                                    <span className="materialMovement-type">
                                        <span className="txt-identifiers">{t('FROM')}:</span> {highlightMatch(materialMovement.from.name, query)}  <span className="txt-identifiers">To:</span> {highlightMatch(materialMovement.to.name, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="materialMovement-description">
                                        <span className="txt-identifiers">{t('QUANTITY')}:</span> {highlightMatch(materialMovement.quantity, query)} {materialMovement.unitOfMeasure}
                                    </span>
                                </div>
                                <div>
                                    <span className="materialMovement-supplier">
                                        <span className="txt-identifiers">{t('NOTES')}:</span> {highlightMatch(materialMovement.notes, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                        </div>
                        <div>
                            <TextSnippetIcon />
                            <span className="materialMovement-name">
                                {highlightMatch(materialMovement.materialName.name, query)}
                            </span>
                        </div>
                        <div>
                            {getMovementIcon(materialMovement.movementType)} 
                            <span className="materialMovement-color">
                                {highlightMatch(materialMovement.movementType, query)}
                            </span>
                        </div>
                        <div>
                            <StorefrontIcon />
                            <span className="materialMovement-type">
                                <span className="txt-identifiers">{t('FROM')}:</span> {highlightMatch(materialMovement.from.name, query)}  <span className="txt-identifiers">To:</span> {highlightMatch(materialMovement.to.name, query)}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-description">
                                <span className="txt-identifiers">{t('QUANTITY')}:</span> {highlightMatch(materialMovement.quantity, query)} {materialMovement.unitOfMeasure}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-supplier">
                                <span className="txt-identifiers">{t('NOTES')}:</span> {highlightMatch(materialMovement.notes, query)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : ''
                  }
                </Grid>
                </Box>
                 : (
                    <div className='progress-container'>
                        {t('NO_MATERIAL_MOVEMENT_AVAILABLE')}
                    </div>
                )}

                {
                    materialMovements.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalUsers / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }

            </div>

        </div>
    )
}

export default MaterialMovements;
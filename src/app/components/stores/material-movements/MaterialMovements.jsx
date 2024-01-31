import '../../Departments.css'
import './MaterialMovements.css'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import axios from 'axios';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import OutboxIcon from '@mui/icons-material/Outbox';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoIcon from '@mui/icons-material/Info';
import AddMaterialMovement from './AddMaterialMovement';




function MaterialMovements() {

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materialMovements, setMaterials] = useState([]);
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
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterials(filtered);
        }
    }, [materialMovements, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/material-movements');
                console.log('The response', response)
                const materialsArr = response.data.materialMovements;
                setMaterials(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingMaterialMovement() {
        dispatch(openDialog({
            children: ( 
                <AddMaterialMovement />
            )
        }))
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
        switch (status) {
            case 'Rejected': return 'error';
            case 'Approved': return 'primary';
            case 'Pending': return 'warning';
            case 'Fulfilled': return 'success';
            case 'Cancelled': return 'default';
            case 'Completed': return 'info';
            case 'Ongoing': return 'secondary';
            default: return 'default';
        }
    };


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingMaterialMovement}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Material Movement</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Material Movements" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
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
                                    <div>
                                        <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                                    </div>
                                    <div>
                                        <TextSnippetIcon />
                                        <span className="materialMovement-name">
                                            {materialMovement.materialName}
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
                                            <span className="txt-identifiers">From: </span> {materialMovement.from}  <span className="txt-identifiers">To: </span> {materialMovement.to}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="materialMovement-description">
                                            <span className="txt-identifiers">Quantity:</span> {materialMovement.quantity} {materialMovement.unitOfMeasure}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="materialMovement-supplier">
                                            <span className="txt-identifiers">Notes:</span> {materialMovement.notes}
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
                                {materialMovement.materialName}
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
                                <span className="txt-identifiers">From:</span> {materialMovement.from} <span className="txt-identifiers">To:</span> {materialMovement.to}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-description">
                                <span className="txt-identifiers">Quantity:</span> {materialMovement.quantity} {materialMovement.unitOfMeasure}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-supplier">
                                <span className="txt-identifiers">Notes:</span> {materialMovement.notes}
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
                                <div>
                                    <Chip className="color-chip" label={materialMovement.status} color={getStatusColor(materialMovement.status)} size="small" />
                                </div>
                                <div>
                                    <TextSnippetIcon />
                                    <span className="materialMovement-name">
                                        {highlightMatch(materialMovement.materialName, query)}
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
                                        <span className="txt-identifiers">From:</span> {highlightMatch(materialMovement.from, query)}  <span className="txt-identifiers">To:</span> {highlightMatch(materialMovement.to, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="materialMovement-description">
                                        <span className="txt-identifiers">Quantity:</span> {highlightMatch(materialMovement.quantity, query)} {materialMovement.unitOfMeasure}
                                    </span>
                                </div>
                                <div>
                                    <span className="materialMovement-supplier">
                                        <span className="txt-identifiers">Notes:</span> {highlightMatch(materialMovement.notes, query)}
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
                                {highlightMatch(materialMovement.materialName, query)}
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
                                <span className="txt-identifiers">From:</span> {highlightMatch(materialMovement.from, query)}  <span className="txt-identifiers">To:</span> {highlightMatch(materialMovement.to, query)}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-description">
                                <span className="txt-identifiers">Quantity:</span> {highlightMatch(materialMovement.quantity, query)} {materialMovement.unitOfMeasure}
                            </span>
                        </div>
                        <div>
                            <span className="materialMovement-supplier">
                                <span className="txt-identifiers">Notes:</span> {highlightMatch(materialMovement.notes, query)}
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

export default MaterialMovements;
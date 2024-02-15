import '../../Departments.css'
import './MaterialMovements.css'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';




function MaterialMovements() {

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materialMovements, setMaterials] = useState([]);
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
                    <Delete itemId={i} />
                )
            }));
        }, 100);
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingMaterialMovement}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Material Movement</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Material Movements" type="search" />

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
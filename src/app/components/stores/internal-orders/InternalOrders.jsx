import '../../Departments.css'
import './InternalOrders.css'
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    CancelOutlined as CancelledIcon,
    ErrorOutline as RejectedIcon,
    LocalShippingOutlined as FulfilledIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddInternalOrder from './AddInternalOrder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function InternalOrders() {

    const currentUserId = window.localStorage.getItem('userId');

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [internalOrders, setInternalOrders] = useState([]);
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
        for (let i = 0; i < internalOrders.length; i++) {
            if (Object.values(internalOrders[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (internalOrders.length > 0 && isQueryFound) {
            const filtered = internalOrders.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterials(filtered);
        }
    }, [internalOrders, query, isQueryFound]);


    useEffect(() => {
        async function getInternalOrders() {
            try {
                // @route: api/items/internalOrders
                // @description: get Internal Orders
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "internalOrders"
                });
                if (res) {
                    setInternalOrders(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getInternalOrders();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddInternalOrder />
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
                    <AddInternalOrder intrlOrder={internalOrders[i]} />
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
                    <Delete itemId={internalOrders[i].internalOrderId} itemType="internalOrders" />
                )
            }));
        }, 100);
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH':
                return 'error'; // red
            case 'MEDIUM':
                return 'warning'; // yellow
            case 'LOW':
                return 'success'; // green
            default:
                return 'default'; // default color
        }
    };    

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <PendingIcon color="action" />;
            case 'APPROVED':
                return <ApprovedIcon color="primary" />;
            case 'REJECTED':
                return <RejectedIcon color="error" />;
            case 'FULFILLED':
                return <FulfilledIcon color="secondary" />;
            case 'CANCELLED':
                return <CancelledIcon color="disabled" />;
            case 'COMPLETED':
                return <CompletedIcon color="success" />;
            case 'ONGOING':
                return <OngoingIcon color="info" />;
            default:
                return null; // or a default icon
        }
    };
    

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Internal Order</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Internal Orders" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {internalOrders.length > 0 && !isQueryFound ? internalOrders.map((internalOrder, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card internalOrder"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog internalOrder">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <Chip id="chip-priority" label={internalOrder.priority} color={getPriorityColor(internalOrder.priority)} size="small" />
                                    </div>
                                    <div>
                                        <CalendarTodayIcon />
                                        <span className="internalOrder-expected-delivery">
                                            {internalOrder.expectedDelivery}
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(internalOrder.status)}
                                        <span className="internalOrder-status">
                                            {internalOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="internalOrder-material">
                                            <span className="txt-identifiers">Material:</span> {internalOrder.material}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="internalOrder-specifics">
                                            <span className="txt-identifiers">Specifics:</span> {internalOrder.specifics}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="internalOrder-notes">
                                            <span className="txt-identifiers">Notes:</span> {internalOrder.notes}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip id="chip-priority" label={internalOrder.priority} color={getPriorityColor(internalOrder.priority)} size="small" />
                        </div>
                        <div>
                            <CalendarTodayIcon />
                            <span className="internalOrder-expected-delivery">
                                {internalOrder.expectedDelivery}
                            </span>
                        </div>
                        <div>
                            {getStatusIcon(internalOrder.status)}
                            <span className="internalOrder-status">
                                {internalOrder.status}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-material">
                                <span className="txt-identifiers">Material:</span> {internalOrder.material}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-specifics">
                                <span className="txt-identifiers">Specifics:</span> {internalOrder.specifics}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-notes">
                                <span className="txt-identifiers">Notes:</span> {internalOrder.notes}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredMaterials && isQueryFound ? filteredMaterials.map((internalOrder, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card internalOrder"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog internalOrder">
                                <div id="edit-container">
                                    <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                    <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                </div>
                                <div>
                                    <Chip id="chip-priority" label={highlightMatch(internalOrder.priority, query)} color={getPriorityColor(internalOrder.priority)} size="small" />
                                </div>
                                <div>
                                    <CalendarTodayIcon />
                                    <span className="internalOrder-expected-delivery">
                                        {highlightMatch(internalOrder.expectedDelivery, query)}
                                    </span>
                                </div>
                                <div>
                                    {getStatusIcon(internalOrder.status)}
                                    <span className="internalOrder-status">
                                        {highlightMatch(internalOrder.status, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-material">
                                        <span className="txt-identifiers">Material:</span> {highlightMatch(internalOrder.material, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-specifics">
                                        <span className="txt-identifiers">Specifics:</span> {highlightMatch(internalOrder.specifics, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-notes">
                                        <span className="txt-identifiers">Notes:</span> {highlightMatch(internalOrder.notes, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip id="chip-priority" label={highlightMatch(internalOrder.priority, query)} color={getPriorityColor(internalOrder.priority)} size="small" />
                        </div>
                        <div>
                            <CalendarTodayIcon />
                            <span className="internalOrder-expected-delivery">
                                {highlightMatch(internalOrder.expectedDelivery, query)}
                            </span>
                        </div>
                        <div>
                            {getStatusIcon(internalOrder.status)}
                            <span className="internalOrder-status">
                                {highlightMatch(internalOrder.status, query)}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-material">
                                <span className="txt-identifiers">Material:</span> {highlightMatch(internalOrder.material, query)}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-specifics">
                                <span className="txt-identifiers">Specifics:</span> {highlightMatch(internalOrder.specifics, query)}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-notes">
                                <span className="txt-identifiers">Notes:</span> {highlightMatch(internalOrder.notes, query)}
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

export default InternalOrders;
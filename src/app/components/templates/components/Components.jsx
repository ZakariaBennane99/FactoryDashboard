import '../../Departments.css'
import './InternalOrders.css'
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
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



function InternalOrders() {

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [internalOrders, setMaterials] = useState([]);
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
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/internal-orders');
                console.log('The response', response)
                const materialsArr = response.data.internalOrders;
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
                <AddInternalOrder />
            )
        }))
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
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
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
                                Material: {highlightMatch(internalOrder.material, query)}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-specifics">
                                Specifics: {highlightMatch(internalOrder.specifics, query)}
                            </span>
                        </div>
                        <div>
                            <span className="internalOrder-notes">
                                Notes: {highlightMatch(internalOrder.notes, query)}
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
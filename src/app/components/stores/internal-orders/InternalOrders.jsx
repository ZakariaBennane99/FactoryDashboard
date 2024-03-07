import '../../Departments.css'
import './InternalOrders.css'
import { TextField, Box, Grid, Paper, Chip } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    CancelOutlined as CancelledIcon,
    ErrorOutline as RejectedIcon,
    LocalShippingOutlined as FulfilledIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddInternalOrder from './AddInternalOrder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};



function InternalOrders() {

    const { t, i18n } = useTranslation('internalOrdersPage');
    const lang = i18n.language;
    
    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "internalorder",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The res', res)
                    const formatted = res.data.internalOrders.map(ctgr => ({ 
                        id: ctgr.Id,
                        department: ctgr.Department,
                        material: ctgr.Material,
                        orderDate: ctgr.OrderDate,
                        expectedDelivery: ctgr.ExpectedDeliveryDate,
                        priority: ctgr.Priority,
                        status: ctgr.Status,
                        quantity: ctgr.Quantity,
                        specifics: ctgr.Specifics,
                        notes: ctgr.Notes
                    }));
                    setTotalCtlgs(res.data.count)
                    setInternalOrders(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getInternalOrders();
    }, []);

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

    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddInternalOrder intrlOrder={false} />
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
                    <Delete itemId={internalOrders[i].id} itemType="internalorder" />
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
                return null;
        }
    };
    

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "internalorder", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedInternalOrders = res.data.map(order => ({
                    id: order.Id,
                    department: order.Department,
                    material: order.Material,
                    orderDate: order.OrderDate,
                    expectedDelivery: order.ExpectedDeliveryDate,
                    priority: order.Priority,
                    status: order.Status,
                    quantity: order.Quantity,
                    specifics: order.Specifics,
                    notes: order.Notes
                }));
                setInternalOrders(formattedInternalOrders); 
                setIsQueryFound(formattedInternalOrders.length > 0);
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
                    <span id="long">{t('ADD_INTERNAL_ORDER')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_INTERNAL_ORDERS')}
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
                     : internalOrders.length > 0 ? 
                    (
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
                                                    {formatDate(internalOrder.expectedDelivery)}
                                                </span>
                                            </div>
                                            <div>
                                                <BusinessCenterIcon />
                                                <span className="internalOrder-expected-delivery">
                                                    {internalOrder.department.Name}
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
                                                    <span className="txt-identifiers">{t('MATERIAL')}:</span> {internalOrder.material.Name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="internalOrder-specifics">
                                                    <span className="txt-identifiers">{t('SPECIFICS')}:</span> {internalOrder.specifics}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="internalOrder-notes">
                                                    <span className="txt-identifiers">{t('NOTES')}:</span> {internalOrder.notes}
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
                                        {formatDate(internalOrder.expectedDelivery)}
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
                                        <span className="txt-identifiers">{t('MATERIAL')}:</span> {internalOrder.material.Name}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-specifics">
                                        <span className="txt-identifiers">{t('SPECIFICS')}:</span> {internalOrder.specifics}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-notes">
                                        <span className="txt-identifiers">{t('NOTES')}:</span> {internalOrder.notes}
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
                                                {highlightMatch(formatDate(internalOrder.expectedDelivery), query)}
                                            </span>
                                        </div>
                                        <div>
                                            <BusinessCenterIcon />
                                            <span className="internalOrder-expected-delivery">
                                                {internalOrder.department.Name}
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
                                                <span className="txt-identifiers">{t('MATERIAL')}:</span> {highlightMatch(internalOrder.material.Name, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="internalOrder-specifics">
                                                <span className="txt-identifiers">{t('SPECIFICS')}:</span> {highlightMatch(internalOrder.specifics, query)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="internalOrder-notes">
                                                <span className="txt-identifiers">{t('NOTES')}:</span> {highlightMatch(internalOrder.notes, query)}
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
                                        {highlightMatch(formatDate(internalOrder.expectedDelivery), query)}
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
                                        <span className="txt-identifiers">{t('MATERIAL')}:</span> {highlightMatch(internalOrder.material.Name, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-specifics">
                                        <span className="txt-identifiers">{t('SPECIFICS')}:</span> {highlightMatch(internalOrder.specifics, query)}
                                    </span>
                                </div>
                                <div>
                                    <span className="internalOrder-notes">
                                        <span className="txt-identifiers">{t('NOTES')}:</span> {highlightMatch(internalOrder.notes, query)}
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
                            {t('NO_INTERNAL_ORDER_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    internalOrders.length > 0 ?
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

export default InternalOrders;
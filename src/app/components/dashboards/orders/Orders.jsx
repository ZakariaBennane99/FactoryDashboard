import '../Departments.css'
import './Orders.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import RulerIcon from '@mui/icons-material/Straighten';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import DescriptionIcon from '@mui/icons-material/Description';
import { showMessage } from 'app/store/fuse/messageSlice';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { CircularProgress } from '@mui/material';





function Orders() {

    const currentUserId = window.localStorage.getItem('userId')

    const [filteredOrders, setFilteredOrders] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchReq, setSearchReq] = useState({
        from: null,
        to: null,
        query: ''
    })
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }

        text = String(text);
    
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
        const stringifiedQry = query.toString()
        setQuery(stringifiedQry);
    
        const found = orders.some(order => 
            Object.values(order).some(value => 
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )
        );
    
        setIsQueryFound(found);
    
        if (!found) {
            // If the search query is not available, perform a 
            // post request to the backend using the searchReq
            // then set the 'orders' to it
            
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
        if (orders.length > 0 && isQueryFound) {
            const filtered = orders.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredOrders(filtered);
        }
    }, [orders, query, isQueryFound]);


    useEffect(() => {
        async function getOrders() {
            try {
                // @route: api/items/ordersDetails
                // @description: get orders Details for the dashboards
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "ordersDetails"
                });
                if (res && res.ordersDetails) {
                    setOrders(res.ordersDetails)
                }
            } catch (error) {
                console.log('ThE ERROR', error)
                // the error msg will be sent so you don't have to hardcode it
                showMsg(error, 'error')
            }
        }
        
        getOrders();
    }, []);


    const handleFromDateChange = (newValue) => {
        setSearchReq(prevState => ({
            ...prevState,
            from: newValue
        }));
    };

    // Handler for the "To" DatePicker
    const handleToDateChange = (newValue) => {
        setSearchReq(prevState => ({
            ...prevState,
            to: newValue
        }));
    };


    return (
        <div className="parent-container">

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="top-ribbon">
                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="From"
                            value={searchReq.from}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="To"
                            value={searchReq.to}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Orders" Order="search" />
                    <button className="add-btn" onClick={handleAddingInternalOrder}>
                        <img src="/assets/gen/plus.svg" /> 
                        <span>Search</span>
                    </button>
                </div>  
            </LocalizationProvider>

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {orders.length > 0 && !isQueryFound ? orders.map((order, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card Order"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog Order">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="order-name">
                                            {order.orderId}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="order-date">
                                            {order.orderId}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="order-amount">
                                            {order.orderName}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="order-status">
                                            {order.templateType}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="order-date">
                                            {order.color}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="order-status">
                                            {order.size}
                                        </span>
                                    </div>
                                    <div>
                                        <PlusOneIcon />
                                        <span className="order-date">
                                            {order.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="order-status">
                                            {order.quantityDetails}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="order-date">
                                            {order.notes}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="order-amount">
                                {order.orderName}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="order-status">
                                {order.templateType}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon /> 
                            <span className="order-date">
                                {order.color}
                            </span>
                        </div>
                        <div>
                            <RulerIcon /> 
                            <span className="order-status">
                                {order.size}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredOrders && isQueryFound ? filteredOrders.map((order, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card Order"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog Order">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="order-name">
                                            {highlightMatch(order.orderId, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <EventIcon />
                                        <span className="order-date">
                                            {highlightMatch(order.orderId, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="order-amount">
                                            {highlightMatch(order.orderName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="order-status">
                                            {highlightMatch(order.templateType, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon /> 
                                        <span className="order-date">
                                            {highlightMatch(order.templateType, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <RulerIcon /> 
                                        <span className="order-status">
                                            {highlightMatch(order.templateType, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PlusOneIcon />
                                        <span className="order-date">
                                            {highlightMatch(order.quantity, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="order-status">
                                            {highlightMatch(order.quantityDetails, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="order-date">
                                            {highlightMatch(order.notes, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="order-amount">
                                {highlightMatch(order.orderName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="order-status">
                                {highlightMatch(order.templateType, query)}
                            </span>
                        </div>
                        <div>
                            <PaletteIcon /> 
                            <span className="order-date">
                                {highlightMatch(order.color, query)}
                            </span>
                        </div>
                        <div>
                            <RulerIcon /> 
                            <span className="order-status">
                                {highlightMatch(order.size, query)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) 
                  : 
                  <div className="progress-container">
                    <CircularProgress />  
                  </div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )
}

export default Orders;
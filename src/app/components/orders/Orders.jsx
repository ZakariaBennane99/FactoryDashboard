import '../Departments.css'
import './Orders.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../Delete';
import AddOrder from './AddOrder';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function Orders() {

    const currentUserId = window.localStorage.getItem('userId');

    const [filteredOrders, setFilteredOrders] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [orders, setOrders] = useState([]);
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
        for (let i = 0; i < Orders.length; i++) {
            if (Object.values(Orders[i]).some(value =>
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
        if (Orders.length > 0 && isQueryFound) {
            const filtered = orders.filter((user) => {
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
                // @route: api/items/orders
                // @description: get orders
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "orders"
                });
                if (res) {
                    setOrders(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getOrders();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddOrder ordr={false} />
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
                    <AddOrder ordr={orders[i]} />
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
                    <Delete itemId={i} itemType='orders' />
                )
            }));
        }, 100);
    }

    function getStatusIcon(status) {
        switch (status) {
          case 'PENDING':
            return <HourglassEmptyIcon />;
          case 'APPROVED':
            return <CheckCircleOutlineIcon />;
          case 'FULFILLED':
            return <TaskAltIcon />;
          case 'CANCELLED':
            return <CancelIcon />;
          case 'COMPLETED':
            return <DoneAllIcon />;
          case 'ONGOING':
            return <AutorenewIcon />;
          case 'REJECTED':
            return <RemoveCircleOutlineIcon />;
          default:
            return null; // or a default icon
        }
    }

    function getSeasonIcon(season) {
        switch (season.toUpperCase()) {
          case 'WINTER':
            return <AcUnitIcon />;
          case 'SUMMER':
            return <WbSunnyIcon />;
          case 'AUTUMN':
            return <FilterDramaIcon />;
          case 'SPRING':
            return <LocalFloristIcon />;
          default:
            return null; 
        }
      }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Order</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Orders" Order="search" />

            </div>  

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
                                            {order.orderNumber}
                                        </span>
                                    </div>
                                    <div>
                                        <EventIcon />
                                        <span className="order-date">
                                            {order.orderDate}
                                        </span>
                                    </div>
                                    <div>
                                        <AttachMoneyIcon /> 
                                        <span className="order-amount">
                                            {order.totalAmount}
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(order.status)}
                                        <span className="order-status">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        {getSeasonIcon(order.season)}
                                        <span className="order-date">
                                            {order.season}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <ConfirmationNumberIcon /> 
                            <span className="order-name">
                                {order.orderNumber}
                            </span>
                        </div>
                        <div>
                            <EventIcon />
                            <span className="order-date">
                                {order.orderDate}
                            </span>
                        </div>
                        <div>
                            <AttachMoneyIcon /> 
                            <span className="order-amount">
                                {order.totalAmount}
                            </span>
                        </div>
                        <div>
                            {getStatusIcon(order.status)}
                            <span className="order-status">
                                {order.status}
                            </span>
                        </div>
                        <div>
                            {getSeasonIcon(order.season)}
                            <span className="order-date">
                                {order.season}
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
                                            {highlightMatch(order.orderNumber, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <EventIcon />
                                        <span className="order-date">
                                            {highlightMatch(order.orderDate, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <AttachMoneyIcon /> 
                                        <span className="order-amount">
                                            {highlightMatch(order.totalAmount.toString(), query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(order.status)}
                                        <span className="order-status">
                                            {highlightMatch(order.status, query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getSeasonIcon(order.season)}
                                        <span className="order-date">
                                            {highlightMatch(order.season, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <ConfirmationNumberIcon /> 
                                        <span className="order-name">
                                            {highlightMatch(order.orderNumber, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <EventIcon />
                                        <span className="order-date">
                                            {highlightMatch(order.orderDate, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <AttachMoneyIcon /> 
                                        <span className="order-amount">
                                            {highlightMatch(order.totalAmount.toString(), query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(order.status)}
                                        <span className="order-status">
                                            {highlightMatch(order.status, query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getSeasonIcon(order.season)}
                                        <span className="order-date">
                                            {highlightMatch(order.season, query)}
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

export default Orders;
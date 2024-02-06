import '../../../components/Departments.css'
import './Orders.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
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



function Orders() {

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

    useEffect(() => {
        if (Orders.length > 0 && isQueryFound) {
            const filtered = Orders.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredOrders(filtered);
        }
    }, [Orders, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getMaterials() {
            try {
                const response = await axios.get('http://localhost:3050/orders');
                console.log('The response', response)
                const materialsArr = response.data.Orders;
                setOrders(materialsArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getMaterials();
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
                    <AddOrder ordr={Orders[i]} />
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

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Order</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Orders" Order="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {orders.length > 0 && !isQueryFound ? Orders.map((order, index) => (
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
                                        <EventIcon />
                                        <span className="order-date">
                                            {order.orderDate}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >   <div>
                            <CategoryIcon /> 
                            <span className="order-name">
                                {Order.templateOrderName}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="order-description">
                                {trimText(Order.description, 30)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredOrders && isQueryFound ? filteredOrders.map((Order, index) => (
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
                                    <CategoryIcon /> 
                                    <span className="Order-name">
                                        {highlightMatch(Order.templateOrderName, query)}
                                    </span>
                                </div>
                                <div>
                                    <DescriptionIcon />
                                    <span className="Order-description">
                                        {highlightMatch(Order.description, query)}
                                    </span>
                                </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <CategoryIcon /> 
                            <span className="Order-name">
                                {highlightMatch(Order.templateOrderName, query)}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="Order-description">
                                {highlightMatch(trimText(Order.description, 30), query)}
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
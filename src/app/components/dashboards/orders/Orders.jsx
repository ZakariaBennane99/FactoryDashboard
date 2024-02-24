import '../../Departments.css'
import './Order.css'
import { TextField, Box, Grid, Paper, FormControl } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PatternIcon from '@mui/icons-material/Pattern';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import GroupIcon from '@mui/icons-material/Group';
import { showMessage } from 'app/store/fuse/messageSlice';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { CircularProgress } from '@mui/material';
import jwtService from '../../../auth/services/jwtService';
import SearchIcon from '@mui/icons-material/Search';
import ProgBar from '../../OrderProgBar';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    CancelOutlined as CancelledIcon,
    ErrorOutline as RejectedIcon,
    LocalShippingOutlined as FulfilledIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



function Orders() {

    const currentUserId = window.localStorage.getItem('userId');

    const navigate = useNavigate(); 

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
                console.log('THE RESPONSE', res)
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

    function calculateOrderProgress(startDate, endDate) {
        const convertDate = (dateString) => {
            const parts = dateString.split("-");
            return new Date(parts[2], parts[1] - 1, parts[0]);
        };
    
        const start = convertDate(startDate).getTime();
        const end = convertDate(endDate).getTime();
        const now = new Date().getTime();
    
        if (now < start) return 0; // Order hasn't started
        if (now > end) return 100; // Order has ended
    
        const totalDuration = end - start;
        const elapsed = now - start;
        const progress = (elapsed / totalDuration) * 100;
    
        return Math.round(progress); // whole number
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


    function getStatusIcon(status) {
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


    const handleModelLinkClick = (modelId, e) => {
        e.preventDefault(); 
        dispatch(closeDialog())
        navigate(`/dashboards/models?modelId=${modelId}`);
    };


    return (
        <div className="parent-container">

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="top-ribbon">
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className='datePicker'
                            label="From"
                            value={searchReq.from}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className="datePicker"
                            label="To"
                            value={searchReq.to}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <TextField
                        className="search dash-search" 
                        label="Search Orders"
                        onChange={(e) => handleSearch(e)}  />
                    <button className="search-btn">
                        <SearchIcon />
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
                                    <div>
                                        <ProgBar value={calculateOrderProgress(order.startDate, order.endDate)} />
                                    </div>
                                    <div className="ord-num">
                                        <ConfirmationNumberIcon />  
                                        <span className="order-number">
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
                                        {getSeasonIcon(order.season)} 
                                        <span className="order-season">
                                            {order.season}
                                        </span>
                                    </div>
                                    <div>
                                        <DateRangeIcon /> 
                                        <span className="order-startDate">
                                            {order.startDate}
                                        </span>
                                    </div>
                                    <div>
                                        <DateRangeIcon /> 
                                        <span className="order-endDate">
                                            {order.endDate}
                                        </span>
                                    </div>
                                    <div> 
                                        <MonetizationOnIcon /> 
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
                                        <span className="order-season">
                                            {order.season}
                                        </span>
                                    </div>
                                    <div>
                                        <FormatListNumberedIcon />
                                        <span className="order-quantityDetails">
                                            {order.quantityDetails}
                                        </span>
                                    </div>
                                    <div> 
                                        <PatternIcon />
                                        <span className="order-templatePattern">
                                            {order.templatePattern}
                                        </span>
                                    </div>
                                    <div> 
                                        <GroupIcon />
                                        <span className="order-modelQuantity">
                                            {order.modelQuantity}
                                        </span>
                                    </div>
                                    <div> 
                                        <MenuBookIcon />
                                        <span className="order-productCatalogue">
                                            {order.productCatalogue}
                                        </span>
                                    </div>
                                    <div>  
                                    <Accordion sx={{ marginTop: '10px', '& .MuiAccordionSummary-root': { height: '32px', minHeight: '0px', '& .MuiAccordionSummary-content': { margin: '0' } }, '& .MuiAccordionDetails-root': { paddingTop: 0 } }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            sx={{ height: '32px', '& .MuiIconButton-edgeEnd': { marginRight: '-8px' } }}
                                        >
                                            <Typography variant="body2">Model Names</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ padding: '0 16px 8px' }}>
                                            <List dense>
                                                {order.modelNames.map((modelName, index) => (
                                                    <ListItem key={index} sx={{ padding: '4px 0' }}>
                                                        <Link
                                                            href={`http://localhost:3000/dashboards/models/${modelName.id}`}
                                                            onClick={(e) => handleModelLinkClick(modelName.id, e) }
                                                            underline="none"
                                                            color="inherit"
                                                        >
                                                            {modelName.name}
                                                        </Link>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <ProgBar value={calculateOrderProgress(order.startDate, order.endDate)} />
                        </div>
                        <div className="ord-num">
                            <ConfirmationNumberIcon /> 
                            <span className="order-number">
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
                            {getSeasonIcon(order.season)} 
                            <span className="order-season">
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
                                    <div>
                                        <ProgBar value={calculateOrderProgress(order.startDate, order.endDate)} />
                                    </div>
                                    <div className="ord-num">
                                        <ConfirmationNumberIcon />  
                                        <span className="order-number">
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
                                        {getSeasonIcon(order.season)} 
                                        <span className="order-season">
                                            {highlightMatch(order.season, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DateRangeIcon /> 
                                        <span className="order-startDate">
                                            {highlightMatch(order.startDate, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DateRangeIcon /> 
                                        <span className="order-endDate">
                                            {highlightMatch(order.endDate, query)}
                                        </span>
                                    </div>
                                    <div> 
                                        <MonetizationOnIcon /> 
                                        <span className="order-amount">
                                            {highlightMatch(order.totalAmount, query)}
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
                                        <span className="order-season">
                                            {highlightMatch(order.season, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <FormatListNumberedIcon />
                                        <span className="order-quantityDetails">
                                            {highlightMatch(order.quantityDetails, query)}
                                        </span>
                                    </div>
                                    <div> 
                                        <PatternIcon />
                                        <span className="order-templatePattern">
                                            {highlightMatch(order.templatePattern, query)}
                                        </span>
                                    </div>
                                    <div> 
                                        <MenuBookIcon />
                                        <span className="order-productCatalogue">
                                            {highlightMatch(order.productCatalogue, query)}
                                        </span>
                                    </div>
                                    <div> 
                                        <LabelImportantIcon />
                                        <span className="order-modelNames">
                                            {order.modelNames.map((name) => highlightMatch(name, query)).join(', ')}
                                        </span>
                                    </div>
                                    <div> 
                                        <GroupIcon />
                                        <span className="order-modelQuantity">
                                            {highlightMatch(order.modelQuantity, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <ProgBar value={calculateOrderProgress(order.startDate, order.endDate)} />
                        </div>
                        <div className="ord-num">
                            <ConfirmationNumberIcon /> 
                            <span className="order-number">
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
                            {getSeasonIcon(order.season)} 
                            <span className="order-season">
                                {order.season}
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
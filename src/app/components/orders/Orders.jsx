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
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





function Orders() {

    const { t, i18n } = useTranslation('ordersPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

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
                setIsLoading(true)
                const res = await jwtService.getItems({ 
                    itemType: "order",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The res', res)
                    const formatted = res.data.orders.map(ctgr => ({ 
                        id: ctgr.Id,
                        orderDate: ctgr.OrderDate,
                        orderNumber: ctgr.OrderNumber,
                        status: ctgr.MainStatus,
                        totalAmount: ctgr.TotalAmount,
                        season: ctgr.Season,
                    }));
                    setTotalCtlgs(res.data.count)
                    setOrders(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
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
                    <Delete itemId={orders[i].id} itemType='order' />
                )
            }));
        }, 100);
    }



    function getStatusIcon(status) {
        switch (status) {
            case 'AWAITING':
            case 'في الانتظار':
                return <PendingIcon color="action" />;
            case 'TODO':
            case 'للعمل':
                return <ApprovedIcon color="primary" />;
            case 'DONE':
            case 'مكتمل':
                return <CompletedIcon color="success" />;
            case 'INPROGRESS':
            case 'جاري التنفيذ':
                return <OngoingIcon color="info" />;
            default:
                return null; 
        }
    }


    function getSeasonIcon(season) {
        switch (season.toUpperCase()) {
          case 'WINTER':
          case 'الشتاء':
            return <AcUnitIcon />;
          case 'SUMMER':
          case 'الصيف':
            return <WbSunnyIcon />;
          case 'AUTUMN':
          case 'الخريف':
            return <FilterDramaIcon />;
          case 'SPRING':
          case 'الربيع':
            return <LocalFloristIcon />;
          default:
            return null; 
        }
    }



    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "order", // Adapted to search for orders
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedOrders = res.data.map(order => ({ 
                    id: order.Id,
                    orderDate: order.OrderDate,
                    orderNumber: order.OrderNumber,
                    status: order.MainStatus,
                    totalAmount: order.TotalAmount,
                    season: order.Season, 
                }));
                setOrders(formattedOrders); // Adapted to set orders
                setIsQueryFound(formattedOrders.length > 0);
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
                    <span>{t('ADD_ORDER')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_ORDER')}
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
                     : orders.length > 0 ? 
                    (
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
                                                    {formatDate(order.orderDate)}
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
                                                {getSeasonIcon(order.season.SeasonName)}
                                                <span className="order-date">
                                                    {order.season.SeasonName}
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
                                        {formatDate(order.orderDate)}
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
                                    {getSeasonIcon(order.season.SeasonName)}
                                    <span className="order-date">
                                        {order.season.SeasonName}
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
                                                    {highlightMatch(formatDate(order.orderDate), query)}
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
                                                {getSeasonIcon(order.season.SeasonName)}
                                                <span className="order-date">
                                                    {highlightMatch(order.season.SeasonName, query)}
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
                                                    {highlightMatch(formatDate(order.orderDate), query)}
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
                                                {getSeasonIcon(order.season.SeasonName)}
                                                <span className="order-date">
                                                    {highlightMatch(order.season.SeasonName, query)}
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
                            {t('NO_ORDER_IS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    orders.length > 0 ?
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

export default Orders;
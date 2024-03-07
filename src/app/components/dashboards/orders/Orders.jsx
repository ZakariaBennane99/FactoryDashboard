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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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
    Loop as OngoingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { useTranslation } from 'react-i18next';
import arLocale from 'date-fns/locale/ar-SA';




function Orders() {

    const { t, i18n } = useTranslation('ordersPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);

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
    
    async function fetchSearchResults() {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "order", // Adjusted to fetch orders
                query: searchReq.query,
                from: searchReq.from,
                to: searchReq.to
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const transformedData = res.data.map(order => ({
                    orderNumber: order.OrderNumber,
                    orderStart: order.Models.reduce((earliest, model) => {
                        const modelStart = model.TrakingModels[0]?.StartTime;
                        return modelStart < earliest || !earliest ? modelStart : earliest;
                    }, null),
                    endDate: order.OrderDate,
                    season: order.Season.SeasonName,
                    totalAmount: order.TotalAmount,
                    MainStatus: order.MainStatus,
                    models: order.Models.map(model => ({
                        id: model.Id,
                        name: model.ModelName,
                        statuses: model.TrakingModels.map(trakingModel => ({
                            status: trakingModel.MainStatus
                        })),
                    })),
                }));
                setOrders(transformedData); // Updating orders state
                setIsQueryFound(transformedData.length > 0); // Reflecting search result found status
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
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
            setIsLoading(true)
            try {
                const res = await jwtService.getOrdersForDash();
                if (res.status === 200) {
                    console.log('The res', res)
                    setTotalCtlgs(res.data.count)
                    setOrders(res.data.transformedData)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
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

    function calculateOrderProgress(models) {
        // Define the total number of statuses and the count of statuses that contribute to progress
        const totalStatuses = models.reduce((acc, model) => acc + model.statuses.length, 0);
        let progressStatusesCount = 0;
    
        const progressContributingStatuses = ['DONE', 'INPROGRESS'];
    
        // Iterate over each model and its statuses to count how many are in progress or done
        models.forEach(model => {
            model.statuses.forEach(statusObj => {
                if (progressContributingStatuses.includes(statusObj.status)) {
                    progressStatusesCount++;
                }
            });
        });
    
        // Calculate the progress as a percentage
        const progressPercentage = (progressStatusesCount / totalStatuses) * 100;
    
        return Math.round(progressPercentage); // Return the progress as a whole number
    }


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

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
            case 'AWAITING':
                return <PendingIcon color="action" />;
            case 'TODO':
                return <ApprovedIcon color="primary" />;
            case 'DONE':
                return <CompletedIcon color="success" />;
            case 'INPROGRESS':
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

    function handleSearchButtonClick() {
        if (searchReq.query && searchReq.query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }


    return (
        <div className="parent-container">

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="top-ribbon">
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className={`datePicker ${lang === 'ar' ? 'rtl' : ''}`}
                            label={t('FROM_LABEL')}
                            value={searchReq.from}
                            onChange={handleFromDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{ width: '18%', height: '100%' }}>
                        <DatePicker
                            className={`datePicker ${lang === 'ar' ? 'rtl' : ''}`}
                            label={t('TO_LABEL')}
                            value={searchReq.to}
                            onChange={handleToDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>
                    <TextField
                        className={`search dash-search ${lang === 'ar' ? 'rtl' : ''}`}
                        label={t('SEARCH_ORDERS')}
                        onChange={(e) => handleSearch(e)} 
                        error={searchError}
                        helperText={searchError ? t('QUERY_ERROR') : ""} />
                    <button className={`search-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                        <SearchIcon />
                        <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                    </button>
                </div>  
            </LocalizationProvider>

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
                                            <div>
                                                <ProgBar value={calculateOrderProgress(order.models)} />
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
                                                    {formatDate(order.endDate)}
                                                </span>
                                            </div>
                                            <div>
                                                {getSeasonIcon(order.season)} 
                                                <span className="order-season">
                                                    {order.season}
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
                                                    {order.MainStatus}
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
                                                    <Typography variant="body2">{t('MODEL_NAMES')}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ padding: '0 16px 8px' }}>
                                                    <List dense>
                                                        {order.models.map((model, index) => (
                                                            <ListItem key={index} sx={{ padding: '4px 0' }}>
                                                                <Link
                                                                    href={`http://localhost:3000/dashboards/models/${model.id}`}
                                                                    onClick={(e) => handleModelLinkClick(model.id, e) }
                                                                    underline="none"
                                                                    color="inherit"
                                                                >
                                                                    {model.name}
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
                                    <ProgBar value={calculateOrderProgress(order.models)} />
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
                                        {formatDate(order.endDate)}
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
                                                <ProgBar value={calculateOrderProgress(order.models)} />
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
                                                    {highlightMatch(formatDate(order.endDate), query)}
                                                </span>
                                            </div>
                                            <div>
                                                {getSeasonIcon(order.season)} 
                                                <span className="order-season">
                                                    {highlightMatch(order.season, query)}
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
                                                    {highlightMatch(order.MainStatus, query)}
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
                                                        {order.models.map((model, index) => (
                                                            <ListItem key={index} sx={{ padding: '4px 0' }}>
                                                                <Link
                                                                    href={`http://localhost:3000/dashboards/models/${model.id}`}
                                                                    onClick={(e) => handleModelLinkClick(model.id, e) }
                                                                    underline="none"
                                                                    color="inherit"
                                                                >
                                                                    {highlightMatch(model.name, query)}
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
                                    <ProgBar value={calculateOrderProgress(order.models)} />
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
                                        {formatDate(order.endDate)}
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
                    ) : (
                        <div className='progress-container'>
                           {t('NO_ORDER_AVAILABLE')}
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
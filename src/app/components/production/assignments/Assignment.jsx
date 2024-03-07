import '../../Departments.css'
import './Assignments.css'
import { TextField, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // due date
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // assign to
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // assigned by
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditTasks from './EditAssignment';
import EditIcon from '@mui/icons-material/Edit';
import jwtService from '../../../auth/services/jwtService/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    CancelOutlined as CancelledIcon,
    ErrorOutline as RejectedIcon,
    LocalShippingOutlined as FulfilledIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import NoteIcon from '@mui/icons-material/Note';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search'






function Assignments() {

    const { t, i18n } = useTranslation('assignmentsPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [filteredtasks, setFilteredtasks] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [tasks, setTasks] = useState([]);
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
    

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < tasks.length; i++) {
            if (Object.values(tasks[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (tasks.length > 0 && isQueryFound) {
            const filtered = tasks.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredtasks(filtered);
        }
    }, [tasks, query, isQueryFound]);


    async function fetchSearchResults() {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "task",
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                setTasks(res.data)
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

    useEffect(() => {
        async function gettasks() {
            try {
                setIsLoading(true);
                const res = await jwtService.getItems({ 
                    itemType: "task"
                });
                console.log(res)
                if (res.status === 200) {
                    setTasks(res.data)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        gettasks();
    }, []);

    function handleSearchButtonClick() {
        if (query && query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }

    function handleEdit(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <EditTasks tsk={tasks[i]} />
                )
            }));
        }, 100);
    }


    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

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


    return (
        <div className="parent-container">

            <div className="top-ribbon">

                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    id="outlined-search" 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`} 
                    label={t('searchTasks')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('queryLongerThan3') : ""}
                    InputLabelProps={{
                        className: lang === 'ar' ? 'rtl-label' : '', 
                    }}
                    InputProps={{
                        className: lang === 'ar' ? 'rtl-input' : '', 
                    }}
                />
                <button className={`search-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('search')}</span>
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
                     : tasks.length > 0 ? 
                     (
                        <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {tasks.length > 0 && !isQueryFound ? tasks.map((task, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card task"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog task">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                            </div>
                                            <div>
                                                <Chip id="chip-priority" label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                                            </div>
                                            <div>
                                                <AssignmentIcon /> 
                                                <span className="task-name">
                                                    {task.taskName}
                                                </span>
                                            </div>
                                            <div>
                                                <AccessTimeIcon />
                                                <span className="task-due">
                                                    {formatDate(task.dueDate) }
                                                </span>
                                            </div>
                                            <div>
                                                {getStatusIcon(task.status)}
                                                <span className="task-status">
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div>
                                                <AccountTreeIcon />
                                                <span className="task-assign-depart">
                                                    {task.createdByDepartment.name}
                                                </span>
                                            </div>
                                            <div>
                                                <BusinessCenterIcon />
                                                <span className="task-assigned-depart">
                                                    {task.assignedToDepartment.name}
                                                </span>
                                            </div>
                                            <div>
                                                <NoteIcon />
                                                <span className="task-nots">
                                                    {task.notes}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <Chip id="chip-priority" label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                                </div>
                                <div>
                                    <AssignmentIcon /> 
                                    <span className="task-name">
                                        {task.taskName}
                                    </span>
                                </div>
                                <div>
                                    <AccessTimeIcon />
                                    <span className="task-due">
                                        {formatDate(task.dueDate) }
                                    </span>
                                </div>
                                <div>
                                    <AccountTreeIcon />
                                    <span className="task-assign-depart">
                                        {task.createdByDepartment.name}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredtasks && isQueryFound ? filteredtasks.map((task, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card task"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog task">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                            </div>
                                            <div>
                                                <Chip id="chip-priority" label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                                            </div>
                                            <div>
                                                <AssignmentIcon /> 
                                                <span className="task-name">
                                                    {task.taskName}
                                                </span>
                                            </div>
                                            <div>
                                                <AccessTimeIcon />
                                                <span className="task-due">
                                                    {formatDate(task.dueDate) }
                                                </span>
                                            </div>
                                            <div>
                                                {getStatusIcon(task.status)}
                                                <span className="task-status">
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div>
                                                <AccountTreeIcon />
                                                <span className="task-assign-depart">
                                                    {task.createdByDepartment.name}
                                                </span>
                                            </div>
                                            <div>
                                                <BusinessCenterIcon />
                                                <span className="task-assigned-depart">
                                                    {task.assignedToDepartment.name}
                                                </span>
                                            </div>
                                            <div>
                                                <NoteIcon />
                                                <span className="task-nots">
                                                    {task.notes}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <Chip id="chip-priority" label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                                </div>
                                <div>
                                    <AssignmentIcon /> 
                                    <span className="task-name">
                                        {highlightMatch(task.taskName, query)}
                                    </span>
                                </div>
                                <div>
                                    <AccessTimeIcon />
                                    <span className="task-due">
                                        {highlightMatch(formatDate(task.dueDate), query)}
                                    </span>
                                </div>
                                <div>
                                    <AccountTreeIcon />
                                    <span className="task-assign-depart">
                                        {highlightMatch(task.createdByDepartment.name, query)}
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
                            {t('noAssignmentAvailable')}
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Assignments
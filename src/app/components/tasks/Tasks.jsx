import '../Departments.css'
import './Tasks.css'
import { TextField, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AssignmentIcon from '@mui/icons-material/Assignment'; // task name
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // due date
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // assign to
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // assigned by
import AddTask from './AddTask';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../Delete';
import {
    CheckCircleOutline as CompletedIcon,
    HourglassEmpty as PendingIcon,
    ThumbUpAltOutlined as ApprovedIcon,
    CancelOutlined as CancelledIcon,
    ErrorOutline as RejectedIcon,
    LocalShippingOutlined as FulfilledIcon,
    Loop as OngoingIcon
} from '@mui/icons-material';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';





function Tasks() {

    const currentUserId = window.localStorage.getItem('userId');

    const [filteredTasks, setFilteredTasks] = useState(null);

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
    
            setFilteredTasks(filtered);
        }
    }, [tasks, query, isQueryFound]);


    useEffect(() => {
        async function getTasks() {
            try {
                // @route: api/items/tasks
                // @description: get a list of current tasks
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "tasks"
                });
                if (res) {
                    setTasks(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getTasks();
    }, []);


    function handleAddingTask() {
        dispatch(openDialog({
            children: ( 
                <AddTask tsk={false}/>
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
                    <AddTask tsk={tasks[i]} />
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
                    <Delete itemId={tasks[i].taskId} itemType="tasks" />
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingTask}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Task</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Tasks" type="search" />

            </div>  

            <div className="main-content">
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
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
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
                                        <BusinessCenterIcon />
                                        <span className="task-assigned-depart">
                                            {task.assignedToDepartment}
                                        </span>
                                    </div>
                                    <div>
                                        <AccountTreeIcon />
                                        <span className="task-assign-depart">
                                            {task.createdByDepartment}
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
                            <AccessTimeIcon />
                            <span className="task-due">
                                {formatDate(task.dueDate) }
                            </span>
                        </div>
                        <div>
                            <BusinessCenterIcon />
                            <span className="task-assigned-depart">
                                {task.assignedToDepartment}
                            </span>
                        </div>
                        <div>
                            <AccountTreeIcon />
                            <span className="task-assign-depart">
                                {task.createdByDepartment}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredTasks && isQueryFound ? filteredTasks.map((task, index) => (
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
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
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
                                            {highlightMatch(formatDate(task.dueDate) , query)}
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(task.status)}
                                        <span className="task-status">
                                            {highlightMatch(task.status, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessCenterIcon />
                                        <span className="task-assigned-depart">
                                            {highlightMatch(task.assignedToDepartment, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <AccountTreeIcon />
                                        <span className="task-assign-depart">
                                            {highlightMatch(task.createdByDepartment, query)}
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
                            <AccessTimeIcon />
                            <span className="task-due">
                                {highlightMatch(formatDate(task.dueDate) , query)}
                            </span>
                        </div>
                        <div>
                            <BusinessCenterIcon />
                            <span className="task-assigned-depart">
                                {highlightMatch(task.assignedToDepartment, query)}
                            </span>
                        </div>
                        <div>
                            <AccountTreeIcon />
                            <span className="task-assign-depart">
                                {highlightMatch(task.createdByDepartment, query)}
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

export default Tasks;
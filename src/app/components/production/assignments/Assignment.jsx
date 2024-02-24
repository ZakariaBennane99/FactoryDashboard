import '../../Departments.css'
import './Assignments.css'
import { TextField, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AssignmentIcon from '@mui/icons-material/Assignment'; // assignment name
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // due date
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // assign to
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // assigned by
import EditAssignments from './EditAssignment';
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






function Assignments() {

    // you get the category (NOT THE CURRENTUSERID) 
    // of the user to show the assignments assigned 
    // to his/her department
    const currentUserId = window.localStorage.getItem('userId');

    const [filteredAssignments, setFilteredAssignments] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [assignments, setAssignments] = useState([]);
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
        for (let i = 0; i < assignments.length; i++) {
            if (Object.values(assignments[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (assignments.length > 0 && isQueryFound) {
            const filtered = assignments.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredAssignments(filtered);
        }
    }, [assignments, query, isQueryFound]);


    useEffect(() => {
        async function getAssignments() {
            try {
                // @route: api/items/assignments
                // @description: get a list of current assignments
                const res = await jwtService.getItems({ 
                    itemType: "assignments"
                });
                if (res) {
                    setAssignments(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getAssignments();
    }, []);


    function handleEdit(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <EditAssignments task={assignments[i]} />
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


    return (
        <div className="parent-container">

            <div className="top-ribbon">

                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Assignments" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {assignments.length > 0 && !isQueryFound ? assignments.map((assignment, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card assignment"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog assignment">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                    </div>
                                    <div>
                                        <Chip id="chip-priority" label={assignment.priority} color={getPriorityColor(assignment.priority)} size="small" />
                                    </div>
                                    <div>
                                        <AssignmentIcon /> 
                                        <span className="assignment-name">
                                            {assignment.assignmentName}
                                        </span>
                                    </div>
                                    <div>
                                        <AccessTimeIcon />
                                        <span className="assignment-due">
                                            {formatDate(assignment.dueDate) }
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(assignment.status)}
                                        <span className="assignment-status">
                                            {assignment.status}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessCenterIcon />
                                        <span className="assignment-assigned-depart">
                                            {assignment.assignedToDepartment}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteIcon />
                                        <span className="assignment-nots">
                                            {assignment.notes}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip id="chip-priority" label={assignment.priority} color={getPriorityColor(assignment.priority)} size="small" />
                        </div>
                        <div>
                            <AccessTimeIcon />
                            <span className="assignment-due">
                                {formatDate(assignment.dueDate) }
                            </span>
                        </div>
                        <div>
                            <AccountTreeIcon />
                            <span className="assignment-assign-depart">
                                {assignment.createdByDepartment}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredAssignments && isQueryFound ? filteredAssignments.map((assignment, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card assignment"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog assignment">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                    </div>
                                    <div>
                                        <Chip id="chip-priority" label={assignment.priority} color={getPriorityColor(assignment.priority)} size="small" />
                                    </div>
                                    <div>
                                        <AssignmentIcon /> 
                                        <span className="assignment-name">
                                            {assignment.assignmentName}
                                        </span>
                                    </div>
                                    <div>
                                        <AccessTimeIcon />
                                        <span className="assignment-due">
                                            {formatDate(assignment.dueDate) }
                                        </span>
                                    </div>
                                    <div>
                                        {getStatusIcon(assignment.status)}
                                        <span className="assignment-status">
                                            {assignment.status}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessCenterIcon />
                                        <span className="assignment-assigned-depart">
                                            {assignment.assignedToDepartment}
                                        </span>
                                    </div>
                                    <div>
                                        <NoteIcon />
                                        <span className="assignment-nots">
                                            {assignment.notes}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <Chip id="chip-priority" label={assignment.priority} color={getPriorityColor(assignment.priority)} size="small" />
                        </div>
                        <div>
                            <AccessTimeIcon />
                            <span className="assignment-due">
                                {highlightMatch(formatDate(assignment.dueDate) , query)}
                            </span>
                        </div>
                        <div>
                            <AccountTreeIcon />
                            <span className="assignment-assign-depart">
                                {highlightMatch(assignment.createdByDepartment, query)}
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

export default Assignments;
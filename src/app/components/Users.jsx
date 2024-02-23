import './Users.css';
import './Departments.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AddUser from './AddUser';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from './Delete';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Switch, FormControlLabel } from '@mui/material';
import jwtService from '../../app/auth/services/jwtService'




function Users() {
    
    // instead of the userId, you should get the userRole
    const currentUserId = window.localStorage.getItem('userId')

    const [filteredUsers, setFilteredUsers] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [users, setUsers] = useState([]);
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
        for (let i = 0; i < users.length; i++) {
            if (Object.values(users[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (users.length > 0 && isQueryFound) {
            const filtered = users.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredUsers(filtered);
        }
    }, [users, query, isQueryFound]);

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
        async function getUsers() {
            try {
                // @route: api/items/users
                // @description: get users
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "users"
                });
                if (res) {
                    setUsers(res)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            }
        }
        
        getUsers();
    }, []);

    function handleAddingUser() {
        dispatch(openDialog({
            children: ( 
                <AddUser usr={null} />
            )
        }))
    }

    function handleEdit(i) {
        console.log(users[i])
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <AddUser user={users[i]} />
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
                    <Delete itemId={users[i].userId} itemType='user' />
                )
            }));
        }, 100);
    }

    function handleAddingRole() {
        dispatch(openDialog({
            children: ( 
                <AddRole />
            )
        }))
    }

    // Add a new function to handle the active toggle
    function handleToggleActive(e, index) {
        const updatedUsers = [...users];
        // Update the active status of the specific user
        updatedUsers[index] = { ...updatedUsers[index], active: e.target.checked };
        setUsers(updatedUsers);
    }



    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn users" onClick={handleAddingUser}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add User</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search-user" label="Search Users" type="search" />
            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {users.length > 0 && !isQueryFound ? users.map((user, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card user"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog user">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="head-container">
                                         <img id="avatar" src={`/assets/images/avatars/${user.userName.toLowerCase()}.jpg`} />
                                         <span className="name">
                                            {user.firstName + ' ' + user.lastName} 
                                         </span>
                                         <span className="category">
                                            {user.category}
                                         </span>
                                         <span>
                                            <FormControlLabel
                                              control={<Switch checked={user.active} onChange={(e) => handleToggleActive(e, index)} />}
                                              label={user.active ? 'Active' : 'Inactive'}
                                            />
                                         </span>
                                     </div>
                                     <div className="full-body-container">
                                            <div className="manager">
                                                <ApartmentIcon />
                                                <span>
                                                   {user.department}
                                                </span>
                                            </div>
                                            <div className="manager">
                                                <EmailIcon />
                                                <span>
                                                   {user.email}
                                                </span>
                                            </div>
                                            <div className="manager">
                                                <PhoneIcon />
                                                <span>
                                                   {user.phoneNumber}
                                                </span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img id="avatar" src={`/assets/images/avatars/${user.userName.toLowerCase()}.jpg`} />
                            <span className="name">
                                {user.firstName + ' ' + user.lastName} 
                            </span>
                        </div>
                        <div className="body-container">
                            <span className="category">
                                {user.category}
                            </span>
                            <div className="manager">
                                <span>
                                    {user.department}
                                </span>
                            </div>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredUsers && isQueryFound ? filteredUsers.map((user, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card user"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog user">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="head-container">
                                        <img id="avatar" src={`/assets/images/avatars/${user.userName.toLowerCase()}.jpg`} />
                                        <span className="name">
                                            {highlightMatch(user.firstName + ' ' + user.lastName, query)}
                                        </span>
                                        <span className="category">
                                            {highlightMatch(user.category, query)}
                                        </span>
                                        <span>
                                            <FormControlLabel
                                              control={<Switch checked={user.active} onChange={(e) => handleToggleActive(e, index)} />}
                                              label={user.active ? 'Active' : 'Inactive'}
                                            />
                                         </span>
                                    </div>
                                    <div className="full-body-container">
                                        <div className="manager">
                                            <ApartmentIcon />
                                            <span>
                                                {highlightMatch(user.department, query)}
                                            </span>
                                        </div>
                                        <div className="manager">
                                            <EmailIcon />
                                            <span>
                                                {highlightMatch(user.email, query)}
                                            </span>
                                        </div>
                                        <div className="manager">
                                            <PhoneIcon />
                                            <span>
                                                {highlightMatch(user.phoneNumber, query)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img id="avatar" src={`/assets/images/avatars/${user.userName.toLowerCase()}.jpg`} />
                            <span className="name">
                                {highlightMatch(user.firstName + ' ' + user.lastName, query)}
                            </span>
                        </div>
                        <div className="body-container">
                            <span className="category">
                                {highlightMatch(user.category, query)}
                            </span>
                            <div className="manager">
                                <span>
                                    {highlightMatch(user.department, query)}
                                </span>
                            </div>
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

export default Users;
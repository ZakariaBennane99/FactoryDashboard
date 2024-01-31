import './Users.css';
import './Departments.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import AddUser from './AddUser';



function Users() {

    const [filteredUsers, setFilteredUsers] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {

        if (!isQueryFound) {
            return text
        }

        // Escape special characters for use in a regular expression
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Split the text into parts based on the query matches
        const parts = text.split(regex);
    
        // Create an array to hold the resulting JSX elements
        const result = [];
    
        // Keep track of the current index in the original text
        let currentIndex = 0;
    
        parts.forEach((part, index) => {
            // Add the non-matching part
            result.push(<span key={`text-${index}`}>{part}</span>);
    
            // Calculate the length of the match in the original text
            const matchLength = text.substr(currentIndex + part.length).match(regex)?.[0]?.length || 0;
    
            if (matchLength > 0) {
                // Add the matching part wrapped in a highlight span
                const match = text.substr(currentIndex + part.length, matchLength);
                result.push(<span key={`highlight-${index}`} className="highlight">{match}</span>);
            }
    
            // Update the current index
            currentIndex += part.length + matchLength;
        });
    
        return result;
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


    useEffect(() => {
        // get the Userments from the backend
        async function getUsers() {
            try {
                const response = await axios.get('http://localhost:3050/users');
                console.log('The response', response)
                const usersArr = response.data.users;
                setUsers(usersArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getUsers();
    }, []);


    function handleAddingUser() {
        dispatch(openDialog({
            children: ( 
                <AddUser />
            )
        }))
    }


    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingUser}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add User</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Users" type="search" />
                <button className="filter-btn">
                    <img src="/assets/gen/filter.svg" /> 
                    <span>Filter</span>
                </button>
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
                                    <div className="head-container">
                                         <img id="avatar" src={`/assets/images/avatars/${user.name.toLowerCase().replace(/\s/g, '')}.jpg`} />
                                         <span className="category">
                                            {user.category}
                                         </span>
                                         <span className="name">
                                            {user.name}
                                         </span>
                                     </div>
                                     <div className="body-container">
                                            <div className="manager">
                                                <span>
                                                   {user.office}
                                                </span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img id="avatar" src={`/assets/images/avatars/${user.name.toLowerCase().replace(/\s/g, '')}.jpg`} />
                            <span className="name">
                                {user.name}
                            </span>
                        </div>
                        <div className="body-container">
                            <span className="category">
                                {user.category}
                            </span>
                            <div className="manager">
                                <span>
                                    {user.office}
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
                                    <div className="head-container">
                                         <img id="avatar" src={`/assets/images/avatars/${user.name.toLowerCase().replace(/\s/g, '')}.jpg`} />
                                         <span className="category">
                                            {highlightMatch(user.category, query)}
                                         </span>
                                         <span className="name">
                                            {highlightMatch(user.name, query)}
                                         </span>
                                     </div>
                                     <div className="body-container">
                                            <div className="manager">
                                                <span>
                                                   {highlightMatch(user.office, query)}
                                                </span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="head-container">
                            <img id="avatar" src={`/assets/images/avatars/${user.name.toLowerCase().replace(/\s/g, '')}.jpg`} />
                            <span className="category">
                                {highlightMatch(user.category, query)}
                            </span>
                            <span className="name">
                                {highlightMatch(user.name, query)}
                            </span>
                        </div>
                        <div className="body-container">
                            <div className="manager">
                                <span>
                                    {highlightMatch(user.name, query)}
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
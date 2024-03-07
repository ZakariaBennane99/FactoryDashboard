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
import jwtService from '../../app/auth/services/jwtService';
import { CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next';



function Users() {

    const { t, i18n } = useTranslation('usersPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [filteredUsers, setFilteredUsers] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    async function fetchSearchResults() {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "auth",
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedUsers = res.data.map(user => ({
                    id: user.Id,
                    firstName: user.Firstname,
                    lastName: user.Lastname,
                    userName: user.Username,
                    email: user.Email,
                    phoneNumber: user.PhoneNumber,
                    department: user.Department ? user.Department.Name : (user.Warehouse ? user.Warehouse.WarehouseName : null),
                    category: user.Department ? user.Department.CategoryName : (user.Warehouse ? "MANAGEMENT" : null),
                    active: user.IsActive,
                    userRole: user.Role,
                    profileImage: user.PhotoPath,
                    password: ''
                }));
                setUsers(formattedUsers)
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

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
        setSearchError(false)
        const query = e.target.value;
        setQuery(query.toLocaleLowerCase())
        
        // check if the query exist
        for (let i = 0; i < users.length; i++) {
            if (Object.values(users[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
            }
        }

        if (query.length <= 3) {
            setSearchError(true);
        } else {
            setSearchError(false);
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
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "auth",
                    page: page,
                    itemsPerPage: itemsPerPage,
                });
                if (res.status === 200) {
                    console.log('The response', res)
                    const formattedUsers = res.data.users.map(user => ({
                        id: user.Id,
                        firstName: user.Firstname,
                        lastName: user.Lastname,
                        userName: user.Username,
                        email: user.Email,
                        phoneNumber: user.PhoneNumber,
                        department: user.Department ? user.Department.Name : (user.Warehouse ? user.Warehouse.WarehouseName : null),
                        category: user.Department ? user.Department.CategoryName : (user.Warehouse ? "MANAGEMENT" : null),
                        active: user.IsActive,
                        userRole: user.Role,
                        profileImage: user.PhotoPath,
                        password: ''
                    }));
                    setUsers(formattedUsers)
                    setTotalUsers(res.data.count)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false); 
            }
        }
        
        getUsers();
    }, [page, itemsPerPage]);

    function handleAddingUser() {
        dispatch(openDialog({
            children: ( 
                <AddUser usr={null} />
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
                    <Delete itemId={users[i].id} itemType='auth' />
                )
            }));
        }, 100);
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
                <button id="btn-generic" className="add-btn users" onClick={handleAddingUser}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_USER')}</span>
                </button>
                <TextField
                    onChange={handleSearch}
                    id="outlined-search"
                    className={`search-user ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_USERS')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""}
                />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
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
                    ) : users.length > 0 ? (
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
                                                 <img id="avatar" src={`http://localhost:3002${user.profileImage}`} />
                                                 <span className="name">
                                                    {user.firstName + ' ' + user.lastName} 
                                                 </span>
                                                 <span className="category">
                                                    {t(user.category)}
                                                 </span>
                                             </div>
                                             <div className="full-body-container">
                                                    {
                                                        user.department ?
                                                            <div className="manager">
                                                                <ApartmentIcon />
                                                                <span>
                                                                   {user.department}
                                                                </span>
                                                            </div> : ''
                                                    }
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
                                    <img id="avatar" src={`http://localhost:3002${user.profileImage}`} />
                                    <span className="name">
                                        {user.firstName + ' ' + user.lastName} 
                                    </span>
                                </div>
                                {
                                    user.department ? 
                                        <div className="body-container">
                                            <span className="category">
                                                {t(user.category)}
                                            </span>
                                            <div className="manager">
                                                <span>
                                                    {user.department}
                                                </span>
                                            </div>
                                        </div>
                                    :
                                    <div style={{ textAlign: 'center' }}>
                                        {t('USER_NOT_ASSIGNED')}
                                    </div>
                                }
                    
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
                                                <img id="avatar" src={`http://localhost:3002${user.profileImage}`} />
                                                <span className="name">
                                                    {highlightMatch(user.firstName + ' ' + user.lastName, query)}
                                                </span>
                                                <span className="category">
                                                    {highlightMatch(user.category, query)}
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
                                <img id="avatar" src={`http://localhost:3002${user.profileImage}`} />
                                <span className="name">
                                    {highlightMatch(user.firstName + ' ' + user.lastName, query)}
                                </span>
                            </div>
                                {
                                    user.department ? 
                                        <div className="body-container">
                                            <span className="category">
                                                {highlightMatch(t(user.category), query)}
                                            </span>
                                            <div className="manager">
                                                <span>
                                                    {highlightMatch(user.department, query)}
                                                </span>
                                            </div>
                                        </div>
                                    :
                                    <div style={{ textAlign: 'center' }}>
                                        {t('USER_NOT_ASSIGNED')}
                                    </div>
                                }
                              </Paper>
                            </Grid>
                          )) : ''
                          }
                        </Grid>
                        </Box>
                    ) : (
                        <div className='progress-container'>
                            {t('NO_USERS_AVAILABLE')}
                        </div>
                    )
                }
                {
                    users.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalUsers / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }
            </div>

        </div>
    )
}

export default Users;
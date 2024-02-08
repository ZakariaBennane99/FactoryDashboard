import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

function AddUser({ user }) { 

    const [departments, setDepartments] = useState(['Engineering Office', 
    'Finance Office', 'Cutting Division I', 'Cutting Division II', 'Tailoring Division', 'Printing'])

    const [userRoles, setUserRoles] = useState(['managerial head', 
    'production manager', 'department head', '', 'Tailoring Division', 'Printing'])

    const [usr, setUser] = useState({
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        userName: user ? user.userName : '',
        password: user ? user.password : '',
        confirmPassword: '',
        phoneNumber: user ? user.phoneNumber : '',
        email: user ? user.email : '',
        department: user ? user.department : '',
        userRole: user
    });

    const handleChange = (prop) => (event) => {
        setUser({ ...usr, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (usr.password !== usr.confirmPassword) {
            // close the current dialog, and show a quick message
            dispatch(closeDialog())
            setTimeout(()=> dispatch(
                showMessage({
                    message: 'Passwords do not match!', // text or html
                    autoHideDuration: 3000, // ms
                    anchorOrigin: {
                        vertical  : 'top', // top bottom
                        horizontal: 'center' // left center right
                    },
                    variant: 'warning' // success error info warning null
            })), 100);
            return; 
        }
        // send the data to the backend
    };

    // a useEffect here to fetch the departments

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={usr.userName}
                        onChange={handleChange('userName')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={usr.firstName}
                        onChange={handleChange('firstName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={usr.lastName}
                        onChange={handleChange('lastName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        value={usr.department}
                        label="Department"
                        onChange={handleChange('department')}
                        required
                    >
                        {departments.map((dept, index) => (
                            <MenuItem key={index} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        value={usr.department}
                        label="Department"
                        onChange={handleChange('department')}
                        required
                    >
                        {departments.map((dept, index) => (
                            <MenuItem key={index} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={usr.email}
                        onChange={handleChange('email')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        type="tel"
                        value={usr.phoneNumber} 
                        onChange={handleChange('phoneNumber')} 
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={usr.password} 
                        onChange={handleChange('password')} 
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={usr.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-user-btn">{user ? 'Update User' : 'Add User'}</button>
            </form>
        </Box>
    );
}

export default AddUser;

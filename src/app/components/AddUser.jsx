import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';


function AddUser({ user }) { 

    const [departments, setDepartments] = useState([
        'Engineering Office', 
        'Finance Office', 
        'Cutting Division I', 
        'Cutting Division II', 
        'Tailoring Division', 
        'Printing'
    ]);

    const [userRoles, setUserRoles] = useState([
        'Managerial Head', 
        'Production Manager', 
        'Departments Head', 
        'Factory Manager'
    ]);

    // Mockup for existing usernames from DB
    const existingUsernames = ['johnDoe', 'janeDoe']; 

    const [usr, setUser] = useState({
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        userName: user ? user.userName : '',
        password: user ? user.password : '',
        confirmPassword: '',
        phoneNumber: user ? user.phoneNumber : '',
        email: user ? user.email : '',
        department: user ? user.department : '',
        userRole: user ? user.userRole : ''
    });

    const [errors, setErrors] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        userRole: '',
        department: ''
    });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateSyrianPhoneNumber = (phoneNumber) => /^(?:\+963)?9\d{9}$|^(?:\+963)?(01|00|02|03|04|05|09)\d{8}$|^(?:\+963)?1\d{9}$/.test(phoneNumber);

    const validateStrongPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    const handleChange = (prop) => (event) => {
        const { value } = event.target;
        setUser({ ...usr, [prop]: value });

        // Reset error state for the current field
        setErrors(prev => ({ ...prev, [prop]: '' }));

        // Field-specific validations
        if (prop === 'userName') {
            if (existingUsernames.includes(value)) {
                setErrors(prev => ({ ...prev, userName: 'Username is already taken.' }));
            }
        } else if (prop === 'email' && !validateEmail(value)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email format.' }));
        } else if (prop === 'phoneNumber' && !validateSyrianPhoneNumber(value)) {
            setErrors(prev => ({ ...prev, phoneNumber: 'Invalid phone number.' }));
        } else if (prop === 'password') {
            if (!validateStrongPassword(value)) {
                setErrors(prev => ({ ...prev, password: 'Password is not strong enough.' }));
            }
            if (usr.confirmPassword && value !== usr.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
            }
        } else if (prop === 'confirmPassword') {
            if (usr.password && value !== usr.password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let formIsValid = true;

        // Check for empty fields and apply validations
        let newErrors = {
            userName: usr.userName ? (existingUsernames.includes(usr.userName) ? 'Username is already taken.' : '') : 'Username is required.',
            firstName: usr.firstName ? '' : 'First name is required.',
            lastName: usr.lastName ? '' : 'Last name is required.',
            email: usr.email ? (validateEmail(usr.email) ? '' : 'Invalid email format.') : 'Email is required.',
            phoneNumber: usr.phoneNumber ? (validateSyrianPhoneNumber(usr.phoneNumber) ? '' : 'Invalid Syrian phone number.') : 'Phone number is required.',
            password: usr.password ? (validateStrongPassword(usr.password) ? '' : 'Password is not strong enough.') : 'Password is required.',
            confirmPassword: usr.confirmPassword ? (usr.password === usr.confirmPassword ? '' : 'Passwords do not match.') : 'Confirm password is required.',
            userRole: usr.userRole ? '' : 'User role is required.',
            department: usr.department ? '' : 'Department is required.'
        };

        // Determine form validity
        Object.values(newErrors).forEach(error => {
            if (error) formIsValid = false;
        });

        setErrors(newErrors);

        if (formIsValid) {
            console.log('Form is valid, submitting data:', usr);
            // Dispatch an action or make API call to submit data
        } else {
            console.log('Form is invalid, please review errors.');
        }
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>

                <FormControl fullWidth margin="normal" error={Boolean(errors.userName)}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={usr.userName}
                        onChange={handleChange('userName')}
                        helperText={errors.userName}
                        error={Boolean(errors.userName)}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.firstName)}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={usr.firstName}
                        onChange={handleChange('firstName')}
                        helperText={errors.firstName}
                        error={Boolean(errors.firstName)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.lastName)}>
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={usr.lastName}
                        onChange={handleChange('lastName')}
                        helperText={errors.lastName}
                        error={Boolean(errors.lastName)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.userRole)}>
                    <InputLabel id="department-label">User Role</InputLabel>
                    <Select
                        labelId="department-label"
                        value={usr.userRole}
                        label="User Role"
                        onChange={handleChange('userRole')}
                        helperText={errors.userRole}
                        error={Boolean(errors.userRole)}
                        required
                    >
                        {userRoles.map((usrRole, index) => (
                            <MenuItem key={index} value={usrRole}>
                                {usrRole}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.department)}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        value={usr.department}
                        label="Department"
                        onChange={handleChange('department')}
                        helperText={errors.department}
                        error={Boolean(errors.department)}
                        required
                    >
                        {departments.map((dept, index) => (
                            <MenuItem key={index} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={usr.email}
                        onChange={handleChange('email')}
                        helperText={errors.email}
                        error={Boolean(errors.email)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNumber)}>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        type="tel"
                        value={usr.phoneNumber} 
                        onChange={handleChange('phoneNumber')} 
                        helperText={errors.phoneNumber}
                        error={Boolean(errors.phoneNumber)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={usr.password} 
                        onChange={handleChange('password')}
                        helperText={errors.password}
                        error={Boolean(errors.password)}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.confirmPassword)} sx={{ mb: 3 }}>
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={usr.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        helperText={errors.confirmPassword}
                        error={Boolean(errors.confirmPassword)}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-user-btn">{user ? 'Update User' : 'Add User'}</button>
            </form>
        </Box>
    );
}

export default AddUser;

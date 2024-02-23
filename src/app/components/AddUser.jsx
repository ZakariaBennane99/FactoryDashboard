import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box, FormHelperText } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';



function AddUser({ user }) { 

    const currentUserId = window.localStorage.getItem('userId')

    const dispatch = useAppDispatch()

    const [fileError, setFileError] = useState('');

    const [userRoles, setUserRoles] = useState([
        'Cutting', 
        'Tailoring', 
        'Printing', 
        'Quality Assurance',
        'Engineering',
        'Manager'
    ]);

    // add another one category: Management and Production
    const [usr, setUser] = useState({
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        userName: user ? user.userName : '',
        password: user ? user.password : '',
        confirmPassword: '',
        phoneNumber: user ? user.phoneNumber : '',
        email: user ? user.email : '',
        department: user ? user.department : '',
        userRole: user ? user.userRole : '',
        category: user ? user.category : '',
        profileImage: null
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
        if (prop === 'email' && !validateEmail(value)) {
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validExtensions.includes(file.type)) {
                // set the file to state
                setUser({...usr, profileImage: file});
            } else {
                setFileError('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
            }
        }
    }

    function showMsg(msg, status) {
        // take the itemId, and delete the item
    
        // then close the dialog, and show a quick message
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

    const handleAddUser = async (event) => {
        event.preventDefault();
        let formIsValid = true;

        // Check for empty fields and apply validations
        let newErrors = {
            userName: usr.userName ? '' : 'Username is required.',
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

            // Create a FormData object
            const formData = new FormData();
            // Append the file to formData if it exists
            if (usr.profileImage) {
                formData.append('profileImage', usr.profileImage);
            }
        
            // Append other user fields to formData
            formData.append('firstName', usr.firstName);
            formData.append('lastName', usr.lastName);
            formData.append('userName', usr.userName);
            formData.append('password', usr.password);
            formData.append('phoneNumber', usr.phoneNumber);
            formData.append('email', usr.email);
            formData.append('department', usr.department);
            formData.append('userRole', usr.userRole);

            try {
                // @route: api/update/user
                // @description: create new user using the request data
                const res = await jwtService.createItem({ 
                    itemType: 'user',
                    data: {
                        data: formData,
                        currentUserId: currentUserId
                    }
                 }, { 'Content-Type': 'multipart/form-data' });
                if (res) {
                    // the msg will be sent so you don't have to hardcode it
                    showMsg('User has been successfully created!', 'success')
                }
            } catch (_errors) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg('User creation failed. Please try again.!', 'error')
            }
        } else {
            console.log('Form is invalid, please review errors.');
        }
    };

    const handleUpdateUser = async (event) => {
        event.preventDefault();
        let formIsValid = true;

        // Check for fields and apply validations
        let newErrors = {
            userName: '', 
            firstName: '',
            lastName: '',
            email: usr.email ? (validateEmail(usr.email) ? '' : 'Invalid email format.') : '',
            phoneNumber: usr.phoneNumber ? (validateSyrianPhoneNumber(usr.phoneNumber) ? '' : 'Invalid Syrian phone number.') : '',
            password: usr.password ? (validateStrongPassword(usr.password) ? '' : 'Password is not strong enough.') : '',
            confirmPassword: (usr.password && usr.confirmPassword) ? (usr.password === usr.confirmPassword ? '' : 'Passwords do not match.') : '',
            userRole: '',
            department: ''
        };

        // Determine form validity
        Object.values(newErrors).forEach(error => {
            if (error) formIsValid = false;
        });

        setErrors(newErrors);

        if (formIsValid) {

            // Create a FormData object
            const formData = new FormData();
        
            // Append the file to formData if it exists
            if (usr.profileImage) {
                formData.append('profileImage', usr.profileImage);
            }
        
            // Append other user fields to formData
            formData.append('firstName', usr.firstName);
            formData.append('lastName', usr.lastName);
            formData.append('userName', usr.userName);
            formData.append('password', usr.password);
            formData.append('phoneNumber', usr.phoneNumber);
            formData.append('email', usr.email);
            formData.append('department', usr.department);
            formData.append('userRole', usr.userRole);

            try {
                const res = await jwtService.updateItem({ 
                    itemType: 'user',
                    data: {
                        data: formData,
                        currentUserId: currentUserId,
                        itemId: usr.userId
                    }
                 }, { 'Content-Type': 'multipart/form-data' });
                if (res) {
                    // the msg will be sent so you don't have to hardcode it
                    showMsg('User has been successfully updated!', 'success');
                }
            } catch (_errors) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg('User update failed. Please try again.', 'error');
            }
        } else {
            console.log('Form is invalid, please review errors.');
        }
    };



    /* TO BE UNCOMMENTED IN PRODUCTION
    // get existing userRoles and departments
    useEffect(() => {    
        async function getRoles() {
            try {
                // @route: api/roles
                // @description: get User Roles
                const res = await jwtService.getRoles({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setDepartments(res)
                    setUserRoles(res.roles)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            }
        }
        
        getRoles();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={user ? handleUpdateUser : handleAddUser}>
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

                <FormControl fullWidth margin="normal" error={Boolean(errors.confirmPassword)}>
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

                <FormControl fullWidth margin="normal" error={Boolean(fileError)} sx={{ mb: 3 }}>
                    <TextField
                        label="User Photo"
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={handleFileChange}
                        error={Boolean(fileError)}
                    />
                    {fileError && <FormHelperText error>{fileError}</FormHelperText>}
                </FormControl>


                <button type="submit" className="add-user-btn">{user ? 'Update User' : 'Add User'}</button>
            </form>
        </Box>
    );
}

export default AddUser;

import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function Profile() {
    
    const dispatch = useDispatch(); 

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        confirmPassword: '',
        photo: 'https://example.com/photo.jpg',
    });

    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

    function showMsg(msg, status) {
        dispatch(closeDialog());
        setTimeout(() => dispatch(
            showMessage({
                message: msg,
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                variant: status
            })), 100);
    }

    const validatePassword = () => {
        let isValid = true;
        if (profile.password.length < 8) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password must be at least 8 characters long!' }));
            isValid = false;
        } else if (!/\d/.test(profile.password) || !/[a-zA-Z]/.test(profile.password)) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password must contain at least one letter and one number!' }));
            isValid = false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        }
        return isValid;
    };

    const validateConfirmPassword = () => {
        if (profile.password !== profile.confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match!' }));
            return false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
            return true;
        }
    };

    const handleChange = (event) => {
        const { name, type, value, files } = event.target;
        setProfile({
            ...profile,
            [name]: type === 'file' ? files[0] : value,
        });

        // Trigger validation for password and confirmPassword fields
        if (name === 'password') {
            validatePassword();
            validateConfirmPassword(); 
        } else if (name === 'confirmPassword') {
            validateConfirmPassword();
        }

    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

        }
    };

    function handleUpdate() {
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        if (!isPasswordValid || !isConfirmPasswordValid) {
            return; 
        }
    }

    return (
        <Box className="profile-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>
            <TextField
                label="First Name"
                name="firstName" 
                variant="outlined"
                value={profile.firstName}
                onChange={handleChange}
            />
            <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={profile.lastName}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={profile.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
            />
            <TextField 
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={profile.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
            />
            <div>
                <img src={profile.photo} alt="Profile" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                <input
                    type="file"
                    name="photo" 
                    onChange={handleFileChange}
                />
            </div>
            <button className='' onClick={handleUpdate}>Update</button>
        </Box>
    )
}

export default Profile;
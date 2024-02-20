import { Box, TextField, FormControl, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './Profile.css';
import './Departments.css';


function Profile() {

    const fileInputRef = React.createRef();
    
    const dispatch = useDispatch(); 

    const [fileError, setFileError] = useState('');

    const [profileImageUrl, setProfileImageUrl] = useState('')

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        confirmPassword: '',
        profileImage: 'https://example.com/photo.jpg',
    });

    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

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
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validExtensions.includes(file.type)) {
                setFileError('')
                // set the file to state
                setProfile({...profile, profileImage: file});
                setProfileImageUrl(URL.createObjectURL(file))
            } else {
                setFileError('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
            }
        }
    };

    async function handleUpdate() {
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        if (!isPasswordValid || !isConfirmPasswordValid) {
            return; 
        }

        // Create a FormData object
        const formData = new FormData();
        // Append the file to formData if it exists
        if (profile.profileImage) {
            formData.append('profileImage', usr.profileImage);
        }
    
        // Append other user fields to formData
        formData.append('firstName', usr.firstName);
        formData.append('lastName', usr.lastName);
        formData.append('password', usr.password);
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

    }

    useEffect(() => {    
        async function getProfiles() {
            try {
                // @route: api/items/profiles
                // @description: get profile based on currentUserId's privilege
                const res = await jwtService.getItems({ 
                    currentUserId: currentUserId,
                    itemType: "profiles"
                });
                if (res) {
                    setProfile(res)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg('An error has happened! Please try again.', 'error')
            }
        }
        
        getProfiles();
    }, []);

    const handleClick = () => {
        fileInputRef.current.click();
    };
    

    return (
        <Box className="profile-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>

            <div className="image-container">
                <img src={ profileImageUrl ? profileImageUrl : 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                 />
                <FormControl fullWidth margin="normal" error={Boolean(fileError)} sx={{ mb: 3 }} style={{ width: '50%' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png" 
                    />
                    <button className='upload-photo-btn' onClick={handleClick}>
                        <CloudUploadIcon /> <span>Upload Photo</span>
                    </button>
                    {fileError && <FormHelperText style={{ width: '100%', textAlign: 'center' }} error>{fileError}</FormHelperText>}
                </FormControl>
            </div>

            <TextField
                label="First Name"
                name="firstName" 
                variant="outlined"
                value={profile.firstName}
                onChange={handleChange}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />
            <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={profile.lastName}
                onChange={handleChange}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
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
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
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
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />

            <button className='add-user-btn' onClick={handleUpdate}>Update</button>
        </Box>
    )
}

export default Profile;
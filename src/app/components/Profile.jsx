import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function Profile() {
    
    const dispatch = useDispatch(); 

    const [fileError, setFileError] = useState('');

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        confirmPassword: '',
        profileImage: 'https://example.com/photo.jpg',
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
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validExtensions.includes(file.type)) {
                // set the file to state
                setProfile({...profile, profileImage: file});
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
                showMsg(_error, 'error')
            }
        }
        
        getProfiles();
    }, []);


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

            <button className='' onClick={handleUpdate}>Update</button>
        </Box>
    )
}

export default Profile;
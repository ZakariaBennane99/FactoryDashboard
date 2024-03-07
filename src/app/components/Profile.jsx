import { Box, TextField, FormControl, FormHelperText } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import jwtService from '../auth/services/jwtService';
import './Profile.css';
import './Departments.css';
import { useTranslation } from 'react-i18next';



function Profile() {

    const { t, i18n } = useTranslation('profilePage');
    const lang = i18n.language;

    const user = useSelector(selectUser);
    console.log('THE DAMEND USER', user)

    const [loading, setLoading] = useState(false)

    const fileInputRef = React.createRef();
    
    const dispatch = useDispatch(); 

    const [fileError, setFileError] = useState('');

    const [profile, setProfile] = useState({
        userId: user.id,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1],
        password: '',
        confirmPassword: '',
        profileImage: `http://localhost:3002${user.userImage}`,
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
        if (profile.password === '') {
            return true
        }
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
        setErrors({ password: '', confirmPassword: '' })
        
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

        setLoading(true)

        // Create a FormData object
        const formData = new FormData();
        // Append the file to formData if it exists
        if (profile.profileImage) {
            formData.append('profiles', profile.profileImage);
        }
        
        const userInfo = JSON.stringify({
            firstname: profile.firstName,
            lastname: profile.lastName,
            password: profile.password
        });
        
        formData.append('userInfo', userInfo);

        try {
            const res = await jwtService.updateItem({ 
                itemType: 'auth',
                data: {
                    data: formData,
                    itemId: profile.userId
                }
             }, { 'Content-Type': 'multipart/form-data' });
            if (res.status === 200) {
                showMsg(res.message, 'success')
            }
        } catch (_errors) {
            showMsg(_errors.message, 'error');
        } finally {
            setLoading(false)
        }

    }

    const handleClick = () => {
        fileInputRef.current.click();
    };



    return (
        <Box className="profile-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>

            <div className="image-container">
                <img src={ profile.profileImage && typeof profile.profileImage === 'string' && profile.profileImage.includes('localhost') ? profile.profileImage : profile.profileImage ? URL.createObjectURL(profile.profileImage) : 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                 />
                <FormControl fullWidth margin="normal" error={Boolean(fileError)} sx={{ mb: 3 }} style={{ width: '50%' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png" 
                    />
                    <button className='upload-photo-btn' style={{ marginRight: lang === 'ar' ? '27px' : '' }} onClick={handleClick}>
                        <CloudUploadIcon /> <span>{t('UPLOAD_PHOTO')}</span>
                    </button>
                    {fileError && <FormHelperText style={{ width: '100%', textAlign: 'center' }} error>{t(fileError)}</FormHelperText>}
                </FormControl>
            </div>

            <TextField
                label={t('FIRST_NAME')}
                name="firstName" 
                variant="outlined"
                value={profile.firstName}
                onChange={handleChange}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />
            <TextField
                label={t('LAST_NAME')}
                name="lastName"
                variant="outlined"
                value={profile.lastName}
                onChange={handleChange}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />
            <TextField
                label={t('PASSWORD')}
                name="password"
                type="password"
                variant="outlined"
                value={profile.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password && t(errors.password)}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />
            <TextField 
                label={t('CONFIRM_PASSWORD')}
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={profile.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword && t(errors.confirmPassword)}
                style={{ width: '100%' }}
                sx={{ mb: 3 }}
            />

            <button disabled={loading} className={`add-user-btn ${loading ? 'disabled-button' : ''}`} onClick={handleUpdate}>
                {loading ? t('UPDATING') : t('UPDATE')}
            </button>
            
        </Box>
    )
}

export default Profile;
import { useState } from 'react';
import { FormControl, FormLabel, InputLabel, Select, MenuItem, TextField, Box, FormHelperText, Switch, FormControlLabel } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';
import { useTranslation } from 'react-i18next';



function AddUser({ user }) { 

    const { t, i18n } = useTranslation('usersPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [fileError, setFileError] = useState('');

    const [userRoles, setUserRoles] = useState([
        'CUTTING', 
        'TAILORING', 
        'PRINTING', 
        'QUALITYASSURANCE',
        'ENGINEERING',
        'FACTORYMANAGER',
        'WAREHOUSEMANAGER'
    ]);

    const [userRolesAr, setUserRolesAr] = useState([
        'القص', 
        'الخياطة', 
        'الطباعة', 
        'ضمان الجودة',
        'الهندسة',
        'مدير المصنع',
        'مدير المستودع'
    ]);

    // add another one category: Management and Production
    const [usr, setUser] = useState({
        id: user ? user.id : '',
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        userName: user ? user.userName : '',
        password: '',
        active: user ? user.active : null,
        confirmPassword: '',
        phoneNumber: user ? user.phoneNumber : '',
        email: user ? user.email : '',
        department: user ? user.department : '',
        userRole: user ? ( lang === 'ar' ? userRolesAr[userRoles.indexOf(user.userRole)] : user.userRole ) : '',
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
        department: '',
        userRole: ''
    });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateSyrianPhoneNumber = (phoneNumber) => /^(?:\+963)?9\d{9}$|^(?:\+963)?(01|00|02|03|04|05|09)\d{8}$|^(?:\+963)?1\d{9}$/.test(phoneNumber);

    const validateStrongPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d).*$/.test(password);

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
        };

        // Determine form validity
        Object.values(newErrors).forEach(error => {
            if (error) formIsValid = false;
        });

        setErrors(newErrors);

        if (formIsValid) {

            setIsLoading(true)

            // Create a FormData object
            const formData = new FormData();
            // Append the file to formData if it exists
            if (usr.profileImage) {
                formData.append('profiles', usr.profileImage);
            }

            const userInfo = JSON.stringify({
                firstname: usr.firstName,
                lastname: usr.lastName,
                username: usr.userName,
                password: usr.password,
                phoneNumber: usr.phoneNumber,
                email: usr.email,
                role: lang === 'ar' ? userRoles[userRolesAr.indexOf(usr.userRole)] : usr.userRole,
            });

            formData.append('userInfo', userInfo)

            try {
                const res = await jwtService.createItem({ 
                    itemType: 'auth',
                    data: formData
                 }, { 'Content-Type': 'multipart/form-data' });
                if (res.status === 201) {
                    showMsg(res.message, 'success')
                }
            } catch (_errors) {
                showMsg(_errors.message, 'error')
            } finally {
                setIsLoading(false)
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
            department: ''
        };

        // Determine form validity
        Object.values(newErrors).forEach(error => {
            if (error) formIsValid = false;
        });

        setErrors(newErrors);

        if (formIsValid) {

            setIsLoading(true)
            // Create a FormData object
            const formData = new FormData();
        
            // Append the file to formData if it exists
            if (usr.profileImage) {
                formData.append('profiles', usr.profileImage);
            }

            const userInfo = JSON.stringify({
                firstname: usr.firstName,
                lastname: usr.lastName,
                username: usr.userName,
                password: usr.password,
                phoneNumber: usr.phoneNumber,
                email: usr.email,
                role: lang === 'ar' ? userRoles[userRolesAr.indexOf(usr.userRole)] : usr.userRole,
                isActive: usr.active
            });
            
            // Append the stringified user information under a single key
            formData.append('userInfo', userInfo);

            try {
                const res = await jwtService.updateItem({ 
                    itemType: 'auth',
                    data: {
                        data: formData,
                        itemId: usr.id
                    }
                 }, { 'Content-Type': 'multipart/form-data' });
                if (res.status === 200) {
                    showMsg(res.message, 'success');
                }
            } catch (_errors) {
                showMsg(_errors.message, 'error');
            } finally {
                setIsLoading(false)
            }
        } else {
            console.log('Form is invalid, please review errors.');
        }
    };

    

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px', boxSizing: 'border-box' }}>
            <form onSubmit={user ? handleUpdateUser : handleAddUser}>

                {
                    user ? 

                    <FormControl component="fieldset" fullWidth margin="normal" sx={{ display: 'flex' }}>
                        <FormLabel component="legend">{t('STATUS')}</FormLabel>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={usr.active}
                                    onChange={(e) => setUser({ ...usr, active: e.target.checked })}
                                />
                            }
                            label={usr.active ? t('ACTIVE') : t('INACTIVE')}
                        />
                    </FormControl>
                    :

                    ''
                }

                <FormControl fullWidth margin="normal" error={Boolean(errors.userName)}>
                    <TextField
                        label={t('USERNAME')}
                        variant="outlined"
                        value={usr.userName}
                        onChange={handleChange('userName')}
                        helperText={errors.userName && t(errors.userName)}
                        error={Boolean(errors.userName)}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.firstName)}>
                    <TextField
                        label={t('FIRST_NAME')}
                        variant="outlined"
                        value={usr.firstName}
                        onChange={handleChange('firstName')}
                        helperText={errors.firstName && t(errors.firstName)}
                        error={Boolean(errors.firstName)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.lastName)}>
                    <TextField
                        label={t('LAST_NAME')}
                        variant="outlined"
                        value={usr.lastName}
                        onChange={handleChange('lastName')}
                        helperText={errors.lastName && t(errors.lastName)}
                        error={Boolean(errors.lastName)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.userRole)}>
                    <InputLabel id="department-label">{t('USER_ROLE')}</InputLabel>
                    <Select
                        labelId="department-label"
                        value={usr.userRole}
                        label={t('USER_ROLE')}
                        onChange={handleChange('userRole')}
                        helperText={errors.userRole && t(errors.userRole)}
                        error={Boolean(errors.userRole)}
                        required={!user}
                    >
                        { lang === 'ar' ? 
                        userRolesAr.map((usrRole, index) => (
                            <MenuItem key={index} value={usrRole}>
                                {usrRole}
                            </MenuItem>
                        )) : 
                        userRoles.map((usrRole, index) => (
                            <MenuItem key={index} value={usrRole}>
                                {usrRole}
                            </MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                    <TextField
                        label={t('EMAIL')}
                        variant="outlined"
                        value={usr.email}
                        onChange={handleChange('email')}
                        helperText={errors.email && t(errors.email)}
                        error={Boolean(errors.email)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNumber)}>
                    <TextField
                        label={t('PHONE_NUMBER')}
                        variant="outlined"
                        type="tel"
                        value={usr.phoneNumber} 
                        onChange={handleChange('phoneNumber')} 
                        helperText={errors.phoneNumber && t(errors.phoneNumber)}
                        error={Boolean(errors.phoneNumber)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                    <TextField
                        label={t('PASSWORD')}
                        variant="outlined"
                        type="password"
                        value={usr.password} 
                        onChange={handleChange('password')}
                        helperText={errors.password && t(errors.password)}
                        error={Boolean(errors.password)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(errors.confirmPassword)}>
                    <TextField
                        label={t('CONFIRM_PASSWORD')}
                        variant="outlined"
                        type="password"
                        value={usr.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        helperText={errors.confirmPassword && t(errors.confirmPassword)}
                        error={Boolean(errors.confirmPassword)}
                        required={!user}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" error={Boolean(fileError)} sx={{ mb: 3 }}>
                    <TextField
                        label={t('USER_PHOTO')}
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={handleFileChange}
                        error={Boolean(fileError)}
                    />
                    {fileError && <FormHelperText error>{fileError && t(fileError)}</FormHelperText>}
                </FormControl>


                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {user ? (isLoading ? t('UPDATING') : t('UPDATE_USER')) : (isLoading ? t('ADDING') : t('ADD_USER'))}
                </button>
            </form>
        </Box>
    );
}

export default AddUser;

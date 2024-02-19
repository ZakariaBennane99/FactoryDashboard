import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';


function AddRole() {

    const currentUserId = window.localStorage.getItem('userId')

    const [roleDetails, setRoleDetails] = useState({
        roleName: '',
        description: '',
    });

    const dispatch = useAppDispatch()

    const handleChange = (prop) => (event) => {
        setRoleDetails({ ...roleDetails, [prop]: event.target.value });
    };

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

    const handleSubmit = async (event) => {
        
        event.preventDefault();

        try {
            // @route: /api/auth/createNewUser
            // @description: create new user Role using the request data
            const res = await jwtService.addUserRole({ 
                currentUserId: currentUserId,
                data: roleDetails
             });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('User has been successfully created!', 'success')
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('User creation failed. Please try again.!', 'error')
        }

    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Role Name"
                        variant="outlined"
                        value={roleDetails.roleName}
                        onChange={handleChange('roleName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={roleDetails.description}
                        onChange={handleChange('description')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-user-btn">Add Role</button>
            </form>
        </Box>
    );
}

export default AddRole;

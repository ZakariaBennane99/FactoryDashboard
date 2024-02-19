import { Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';



function Profile({ userId }) {

    const dispatch = useAppDispatch();

    function showMsg(msg, status) {
        dispatch(closeDialog())
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

    async function updateProfile() {
        try {
            // Assuming jwtService has a method for updating user profile
            const res = await jwtService.updateProfile({ userId: userId });
            if (res) {
                showMsg('Profile updated successfully!', 'success')
            }
        } catch (_errors) {
            showMsg('Profile update failed. Please try again.', 'error')
        }
    }

    return (
        <Box className="profile-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>
            <p>Profile Component Content Here</p>
            <div className="button-container">
                <button className="update-button" onClick={() => updateProfile()} >Update Profile</button>
            </div>
        </Box>
    )
}

export default Profile
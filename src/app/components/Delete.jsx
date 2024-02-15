import { Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';



function DeleteItem({ itemId, itemType }) {

    const currentUserId = window.localStorage.getItem('userId')

    const dispatch = useAppDispatch();


    function showMsg(msg, status) {
        // then close the dialog, and show a quick message
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg, //'Item deleted successfully!', // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: status // success error info warning null
            })), 100);
    }


    // this function will call the backend to 
    // delete the item depending on the itemType
    async function deleteItem() {
        try {
            // @route: /api/delete/{itemType}
            // @description: delete an item
            const res = await jwtService.deleteItem({ 
                currentUserId: currentUserId,
                itemType: itemType,
                itemId: itemId
             });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('User has been successfully created!', 'success')
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('User creation failed. Please try again.!', 'error')
        }
    }

    return (
        <Box className="delete-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>
            <p>Are you sure you want to delete this item?</p>
            <div className="button-container">
                <button className="yes-button" onClick={() => deleteItem()} >Yes</button>
                <button className="no-button" onClick={() => dispatch(closeDialog())} >No</button>
            </div>
        </Box>
    )
}

export default DeleteItem
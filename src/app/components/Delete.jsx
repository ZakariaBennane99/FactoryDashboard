import { Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';



function DeleteItem({ itemId }) {

    const dispatch = useAppDispatch();


    // this function will call the backend to 
    // delete the item
    async function deleteItem() {
        // take the itemId, and delete the item


        // then close the dialog, and show a quick message
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: 'Item deleted successfully!', // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: 'success' // success error info warning null
            })), 100);
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

export default DeleteItem;
import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../../app/auth/services/jwtService'
import { showMessage } from 'app/store/fuse/messageSlice';


function AddModelSize({ sze }) {

    const currentUserId = window.localStorage.getItem('userId')

    const [modelSize, setModelSize] = useState({
        orderDetailName: sze ? sze.orderDetailName : '',
        sizeName: sze ? sze.sizeName : ''
    });

    function showMsg(msg, status) {
    
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

    const handleChange = (prop) => (event) => {
        setModelSize({ ...modelSize, [prop]: event.target.value });
    };

    const handleAddSize = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/modelsSize
            // @description: create a new modelsSize
            const res = await jwtService.createItem({ 
                itemType: 'modelsSize',
                data: {
                    data: modelSize,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };

    const handleUpdateSize = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/modelsSize
            // @description: update models Size
            const res = await jwtService.updateItem({ 
                itemType: 'modelsSize',
                data: {
                    data: modelSize,
                    currentUserId: currentUserId,
                    itemId: sze.sizeId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={sze ? handleUpdateSize : handleAddSize}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Order Detail Name"
                        variant="outlined"
                        value={modelSize.sizeName}
                        onChange={handleChange('orderDetailName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Size Name"
                        variant="outlined"
                        value={modelSize.orderDetailName}
                        onChange={handleChange('sizeName')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{sze ? 'Update' : 'Add'} Size</button>
            </form>
        </Box>
    );
}

export default AddModelSize;
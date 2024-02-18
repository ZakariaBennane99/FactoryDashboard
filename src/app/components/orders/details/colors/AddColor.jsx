import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../../app/auth/services/jwtService'
import { showMessage } from 'app/store/fuse/messageSlice';


function AddColor({ clr }) {

    const currentUserId = window.localStorage.getItem('userId')

    const [color, setColor] = useState({
        orderId: clr ? clr.orderId : null,
        colorName: clr ? clr.colorName : ''
    });

    const handleChange = (prop) => (event) => {
        setColor({ ...color, [prop]: event.target.value });
    };

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

    const handleUpdateColor = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/update/cataloguesColor
            // @description: update an existing catalogue's Color
            const res = await jwtService.updateItem({ 
                itemType: 'cataloguesColor',
                data: {
                    data: color,
                    currentUserId: currentUserId,
                    itemId: clr.colorId
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


    const handleAddColor = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/cataloguesColor
            // @description: create a new cataloguesColor
            const res = await jwtService.createItem({ 
                itemType: 'cataloguesColor',
                data: {
                    data: color,
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


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={clr ? handleUpdateColor : handleAddColor}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color Name"
                        variant="outlined"
                        value={color.colorName}
                        onChange={handleChange('colorName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Order Id"
                        variant="outlined"
                        value={color.orderId}
                        onChange={handleChange('orderId')}
                        type='number'
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{clr ? 'Update' : 'Add'} Color</button>
            </form>
        </Box>
    );
}

export default AddColor;

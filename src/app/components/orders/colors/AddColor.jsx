import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../../../../app/auth/services/jwtService'


function AddColor({ clr }) {

    const currentUserId = window.localStorage.getItem('userId')

    const dispatch = useAppDispatch()

    const [color, setColor] = useState({
        colorName: clr ? clr.colorName : '',
        colorCode: clr ? clr.colorCode : '',
        description: clr ? clr.description : ''
    });

    const handleChange = (prop) => (event) => {
        setColor({ ...color, [prop]: event.target.value });
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

    const handleUpdateColor = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/modelsColor
            // @description: update an existing models' color
            const res = await jwtService.updateItem({ 
                itemType: 'modelsColor',
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
            // @route: api/create/modelsColor
            // @description: create a new models' color
            const res = await jwtService.createItem({ 
                itemType: 'modelsColor',
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

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color Code"
                        variant="outlined"
                        value={color.colorCode}
                        onChange={handleChange('colorCode')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={color.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{clr ? 'Update' : 'Add'} Color</button>
            </form>
        </Box>
    );
}

export default AddColor;
import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function AddTextile({ txtle }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [textile, setTextile] = useState({
        textileName: txtle ? txtle.textileName : '',
        textileType: txtle ? txtle.textileType : '',
        composition: txtle ? txtle.composition : '',
        description: txtle ? txtle.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTextile({ ...textile, [prop]: event.target.value });
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

    const handleAddTextiles = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/textiles
            // @description: create a new textile
            const res = await jwtService.createItem({ 
                itemType: 'textiles',
                data: {
                    data: textile,
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

    const handleUpdateTextiles = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/textiles
            // @description: update existing textile
            const res = await jwtService.updateItem({ 
                itemType: 'textiles',
                data: {
                    data: textile,
                    currentUserId: currentUserId,
                    itemId: txtle.textilesId
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
            <form onSubmit={txtle ? handleUpdateTextiles : handleAddTextiles}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Textile Name"
                        variant="outlined"
                        value={textile.textileName}
                        onChange={handleChange('textileName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Textile Type"
                        variant="outlined"
                        value={textile.textileType}
                        onChange={handleChange('textileType')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Composition"
                        variant="outlined"
                        value={textile.composition}
                        onChange={handleChange('composition')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={textile.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-textile-btn">{ txtle ? 'Update' : 'Add' } Textile</button>
            </form>
        </Box>
    );
}

export default AddTextile;

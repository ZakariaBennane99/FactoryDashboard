import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddCategoryI({ ctgrI }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [categoryI, setCategoriesI] = useState({
        name: ctgrI ? ctgrI.mame : '',
        description: ctgrI ? ctgrI.description : '',
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
        setCategoriesI({ ...categoryI, [prop]: event.target.value });
    };

    const handleAddCategoryI = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/categoryI
            // @description: create a new categoryI
            const res = await jwtService.createItem({ 
                itemType: 'categoryI',
                data: {
                    data: categoryI,
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

    const handleUpdateCategoryI = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/categoryI
            // @description: update category I
            const res = await jwtService.updateItem({ 
                itemType: 'categoryI',
                data: {
                    data: categoryI,
                    currentUserId: currentUserId,
                    itemId: ctgrI.categoryIId
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
            <form onSubmit={ctgrI ? handleUpdateCategoryI : handleAddCategoryI}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Category I Name"
                        variant="outlined"
                        value={categoryI.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={categoryI.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-categoryI-btn">{ctgrI ? 'Update' : 'Add'} Category I</button>
            </form>
        </Box>
    );
}

export default AddCategoryI;

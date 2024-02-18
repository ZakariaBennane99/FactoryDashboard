import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddCategoryII({ ctgrII }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [categoryII, setCategoriesII] = useState({
        name: ctgrII ? ctgrII.name : '',
        description: ctgrII ? ctgrII.description : '',
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
        setCategoriesII({ ...categoryII, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(categoryII);
    };

    const handleAddCategoryII = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/categoryII
            // @description: create a new categoryII
            const res = await jwtService.createItem({ 
                itemType: 'categoryII',
                data: {
                    data: categoryII,
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


    const handleUpdateCategoryII = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/categoryII
            // @description: update category II
            const res = await jwtService.updateItem({ 
                itemType: 'categoryI',
                data: {
                    data: categoryII,
                    currentUserId: currentUserId,
                    itemId: ctgrII.categoryIIId
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
            <form onSubmit={ctgrII ? handleUpdateCategoryII : handleAddCategoryII}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Category II Name"
                        variant="outlined"
                        value={categoryII.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={categoryII.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-categoryII-btn">{ctgrII ? 'Update' : 'Add'} Category II</button>
            </form>
        </Box>
    );
}

export default AddCategoryII;

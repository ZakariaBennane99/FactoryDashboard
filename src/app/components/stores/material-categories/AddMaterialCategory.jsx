import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddMaterial({ mtrlCat }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [materialCategory, setMaterial] = useState({
        name: mtrlCat ? mtrlCat.name : '',
        description: mtrlCat ? mtrlCat.description : '',
    });

    const handleChange = (prop) => (event) => {
        setMaterial({ ...materialCategory, [prop]: event.target.value });
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

    const handleAddMaterialCategories = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/materialCategories
            // @description: create a new Material Category
            const res = await jwtService.createItem({ 
                itemType: 'materialCategories',
                data: {
                    data: materialCategory,
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

    const handleUpdateMaterialCategories = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/materialCategories
            // @description: update existing material category
            const res = await jwtService.updateItem({ 
                itemType: 'materialCategories',
                data: {
                    data: materialCategory,
                    currentUserId: currentUserId,
                    itemId: mtrlCat.materialCategoriesId
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
            <form onSubmit={mtrlCat ? handleUpdateMaterialCategories : handleAddMaterialCategories}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Category Name"
                        variant="outlined"
                        value={materialCategory.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={materialCategory.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-materialCategory-btn">{mtrlCat ? 'Update' : 'Add'} Material Category</button>
            </form>
        </Box>
    );
}

export default AddMaterial;

import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddProductCatalogue({  prdctCatalogue }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [productCatalogue, setProductCatalogue] = useState({
        name: prdctCatalogue ? prdctCatalogue.name : '',
        description: prdctCatalogue ? prdctCatalogue.description : '',
    });

    const handleChange = (prop) => (event) => {
        setProductCatalogue({ ...productCatalogue, [prop]: event.target.value });
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

    const handleAddProductCatalogues = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/productCatalogues
            // @description: create a new Product Catalogue
            const res = await jwtService.createItem({ 
                itemType: 'productCatalogues',
                data: {
                    data: productCatalogue,
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

    const handleUpdateProductCatalogues = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/productCatalogues
            // @description: update existing Product Catalogue
            const res = await jwtService.updateItem({ 
                itemType: 'productCatalogues',
                data: {
                    data: productCatalogue,
                    currentUserId: currentUserId,
                    itemId: prdctCatalogue.productCataloguesId
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
            <form onSubmit={prdctCatalogue ? handleUpdateProductCatalogues : handleAddProductCatalogues}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Product Catalogue Name"
                        variant="outlined"
                        value={productCatalogue.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={productCatalogue.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-productCatalogue-btn">{prdctCatalogue ? 'Update' : 'Add'} Product Catalogue</button>
            </form>
        </Box>
    );
}

export default AddProductCatalogue;

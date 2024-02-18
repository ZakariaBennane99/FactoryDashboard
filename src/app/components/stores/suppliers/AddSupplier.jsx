import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddSupplier({ splier }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [supplier, setSupplier] = useState({
        name: splier ? splier.name : '',
        phone: splier ? splier.phone : '',
        email: splier ? splier.email : '',
        address: splier ? splier.address : ''
    });

    const handleChange = (prop) => (event) => {
        setSupplier({ ...supplier, [prop]: event.target.value });
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

    const handleAddSuppliers = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/suppliers
            // @description: create a new supplier
            const res = await jwtService.createItem({ 
                itemType: 'suppliers',
                data: {
                    data: supplier,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                showMsg(res, 'success')
            }
        } catch (_error) {
            showMsg(_error, 'error')
        } 
    };

    const handleUpdateSuppliers = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/suppliers
            // @description: update an existing supplier
            const res = await jwtService.updateItem({ 
                itemType: 'suppliers',
                data: {
                    data: supplier,
                    currentUserId: currentUserId,
                    itemId: splier.suppliersId
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
            <form onSubmit={splier ? handleUpdateSuppliers : handleAddSuppliers}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Supplier Name"
                        variant="outlined"
                        value={supplier.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Phone"
                        variant="outlined"
                        value={supplier.phone}
                        onChange={handleChange('phone')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={supplier.email}
                        onChange={handleChange('email')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Address"
                        variant="outlined"
                        value={supplier.address}
                        onChange={handleChange('address')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-supplier-btn">{splier ? 'Update' : 'Add'} Supplier</button>
            </form>
        </Box>
    );
}

export default AddSupplier;

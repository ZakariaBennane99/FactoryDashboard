import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddOrder({ ordr }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [order, setOrder] = useState({
        orderNumber: ordr ? ordr.orderNumber : '',
        orderDate: ordr ? new Date(ordr.orderDate) : null,
        totalAmount: ordr ? ordr.totalAmount : 0,
        status: ordr ? ordr.status : '',
        season: ordr ? ordr.season : ''
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
        setOrder({ ...order, [prop]: event.target.value });
    };

    const handleDateChange = (date) => {
        setOrder({ ...order, orderDate: date });
    };

    const handleAddOrder = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/order
            // @description: create a new order
            const res = await jwtService.createItem({ 
                itemType: 'order',
                data: {
                    data: order,
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

    const handleUpdateOrder = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/order
            // @description: update models Size
            const res = await jwtService.updateItem({ 
                itemType: 'order',
                data: {
                    data: order,
                    currentUserId: currentUserId,
                    itemId: ordr.orderId
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={ordr ? handleUpdateOrder : handleAddOrder}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Order Number"
                            variant="outlined"
                            type="number"
                            value={order.orderNumber}
                            onChange={handleChange('orderNumber')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Order Date"
                            value={order.orderDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Total Amount"
                            variant="outlined"
                            type="number"
                            value={order.totalAmount}
                            onChange={handleChange('totalAmount')}
                            required
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Status"
                            variant="outlined"
                            value={order.status}
                            onChange={handleChange('status')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label="Season"
                            variant="outlined"
                            value={order.season}
                            onChange={handleChange('season')}
                            required
                        />
                    </FormControl>

                    <button type="submit" className="add-user-btn">
                        {ordr ? 'Update' : 'Add'} Order
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddOrder;

import { useState } from 'react';
import { FormControl, TextField, Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AddOrder({ ordr }) {
    const [order, setOrder] = useState({
        orderNumber: ordr ? ordr.orderNumber : '',
        orderDate: ordr ? new Date(ordr.orderDate) : null,
        totalAmount: ordr ? ordr.totalAmount : 0,
        status: ordr ? ordr.status : '',
        season: ordr ? ordr.season : ''
    });

    const handleChange = (prop) => (event) => {
        setOrder({ ...order, [prop]: event.target.value });
    };

    const handleDateChange = (date) => {
        setOrder({ ...order, orderDate: date });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(order);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={handleSubmit}>
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

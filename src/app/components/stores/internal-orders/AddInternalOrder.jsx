import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AddInternalOrder({ intrlOrder }) {
    const [internalOrder, setInternalOrder] = useState({
        expectedDelivery: intrlOrder ? new Date(intrlOrder.expectedDelivery) : null,
        priority: intrlOrder ? intrlOrder.priority : '',
        status: intrlOrder ? intrlOrder.status : '',
        material: intrlOrder ? intrlOrder.material : '',
        quantity: intrlOrder ? intrlOrder.quantity : 0,
        specifics: intrlOrder ? intrlOrder.specifics : '',
        notes: intrlOrder ? intrlOrder.notes : ''
    });

    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    const statuses = [
        'PENDING', 'APPROVED', 'REJECTED', 'FULFILLED',
        'CANCELLED', 'COMPLETED', 'ONGOING'
    ];
    // Mock materials array, replace with actual data if needed
    const materials = [
        'Material 1',
        'Material 2',
        'Material 3',
    ];

    const handleChange = (prop) => (event) => {
        setInternalOrder({ ...internalOrder, [prop]: event.target.value });
    };

    const handleDateChange = (date) => {
        setInternalOrder({ ...internalOrder, expectedDelivery: date });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(internalOrder);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Expected Delivery"
                            value={internalOrder.expectedDelivery}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-select-label">Priority</InputLabel>
                        <Select
                            labelId="priority-select-label"
                            id="priority-select"
                            value={internalOrder.priority}
                            label="Priority"
                            onChange={handleChange('priority')}
                            required
                        >
                            {priorities.map((priority, index) => (
                                <MenuItem key={index} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={internalOrder.status}
                            label="Status"
                            onChange={handleChange('status')}
                            required
                        >
                            {statuses.map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="material-select-label">Material</InputLabel>
                        <Select
                            labelId="material-select-label"
                            id="material-select"
                            value={internalOrder.material}
                            label="Material"
                            onChange={handleChange('material')}
                            required
                        >
                            {materials.map((material, index) => (
                                <MenuItem key={index} value={material}>
                                    {material}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={internalOrder.quantity}
                            onChange={handleChange('quantity')}
                            required
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Specifics"
                            variant="outlined"
                            value={internalOrder.specifics}
                            onChange={handleChange('specifics')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label="Notes"
                            variant="outlined"
                            value={internalOrder.notes}
                            onChange={handleChange('notes')}
                            multiline
                            rows={3}
                            required
                        />
                    </FormControl>

                    <button type="submit" className="add-internalOrder-btn">{intrlOrder ? "Update" : "Add"} Internal Order</button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddInternalOrder;

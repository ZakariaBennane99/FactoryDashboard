import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

function AddWarehouse({ wrhouse }) {

    const [managers, setManagers] = useState([
        'Moha Itani',
        'Alfered Maha',
        'Istovav Monk'
    ])

    const [warehouse, setWarehouse] = useState({
        name: wrhouse ? wrhouse.name : '',
        location: wrhouse ? wrhouse.location : '',
        capacity: wrhouse ? wrhouse.capacity : '',
        manager: wrhouse ? wrhouse.manager : ''
    });

    const handleChange = (prop) => (event) => {
        setWarehouse({ ...warehouse, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(warehouse);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Warehouse Name"
                        variant="outlined"
                        value={warehouse.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Location"
                        variant="outlined"
                        value={warehouse.location}
                        onChange={handleChange('location')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Capacity"
                        variant="outlined"
                        type="number"
                        value={warehouse.capacity}
                        onChange={handleChange('capacity')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{ min: 0 }} // Prevents negative numbers
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        value={warehouse.manager}
                        label="Manager"
                        onChange={handleChange('manager')}
                        required
                    >
                        {managers.map((manager, index) => (
                            <MenuItem key={index} value={manager}>
                                {manager}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <button type="submit" className="add-warehouse-btn">{wrhouse ? 'Update' : 'Add'} Warehouse</button>
            </form>
        </Box>
    );
}

export default AddWarehouse;

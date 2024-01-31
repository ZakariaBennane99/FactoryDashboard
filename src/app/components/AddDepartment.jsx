import React from 'react';
import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

function AddDepartment() {

    const [managers, setManagers] = useState(['Chris Evans', 'Marly Manson', 'Tim Bergling'])

    const [department, setDepartment] = React.useState({
        name: '',
        manager: '',
        category: '',
        description: ''
    });

    const handleChange = (prop) => (event) => {
        setDepartment({ ...department, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(department);
    };


    // get the list of the users from the backend
    async function getMangers() {
        const b = ''
    }

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Department Name"
                        variant="outlined"
                        value={department.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        value={department.manager}
                        label="Manager"
                        onChange={handleChange('manager')}
                        required
                    >
                        {
                            managers.map(manager => <MenuItem value={manager.replace(/\s+/g, '').toLowerCase()}>{manager}</MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={department.category}
                        label="Category"
                        onChange={handleChange('category')}
                        required
                    >
                        <MenuItem value={'Management'}>Management</MenuItem>
                        <MenuItem value={'Production'}>Production</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        value={department.description}
                        onChange={handleChange('description')}
                        variant="outlined"
                        required
                    />
                </FormControl>

                <button type="submit" className="add-depart-btn">Add Department</button>
            </form>
        </Box>
    );
}

export default AddDepartment;

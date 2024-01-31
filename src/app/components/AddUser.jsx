import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

function AddUser() { 

    const [departments, setDepartments] = useState(['Engineering Office', 
    'Finance Office', 'Cutting Division I', 'Cutting Division II', 'Tailoring Division', 'Printing'])

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: ''
    });

    const handleChange = (prop) => (event) => {
        setUser({ ...user, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(user);
        // Add logic to process the data, such as sending to a backend server
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={user.firstName}
                        onChange={handleChange('firstName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={user.lastName}
                        onChange={handleChange('lastName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={user.email}
                        onChange={handleChange('email')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        value={user.department}
                        label="Department"
                        onChange={handleChange('department')}
                        required
                    >
                        {departments.map((dept, index) => (
                            <MenuItem key={index} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <button type="submit" className="add-user-btn">Add User</button>
            </form>
        </Box>
    );
}

export default AddUser;

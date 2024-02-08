import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddRole() {
    const [roleDetails, setRoleDetails] = useState({
        roleName: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setRoleDetails({ ...roleDetails, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(roleDetails);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Role Name"
                        variant="outlined"
                        value={roleDetails.roleName}
                        onChange={handleChange('roleName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={roleDetails.description}
                        onChange={handleChange('description')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-user-btn">Add Role</button>
            </form>
        </Box>
    );
}

export default AddRole;

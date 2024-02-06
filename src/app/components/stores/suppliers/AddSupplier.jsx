import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddSupplier({ splier }) {

    const [supplier, setSupplier] = useState({
        name: splier ? splier.name : '',
        phone: splier ? splier.phone : '',
        email: splier ? splier.email : '',
        address: splier ? splier.address : ''
    });

    const handleChange = (prop) => (event) => {
        setSupplier({ ...supplier, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(supplier);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
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
                        required
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

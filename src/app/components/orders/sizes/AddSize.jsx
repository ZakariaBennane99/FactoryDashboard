import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddSize({ sze }) {
    const [size, setSize] = useState({
        sizeName: sze ? sze.sizeName : '',
        description: sze ? sze.description: ''
    });

    const handleChange = (prop) => (event) => {
        setSize({ ...size, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(size);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Size Name"
                        variant="outlined"
                        value={size.sizeName}
                        onChange={handleChange('sizeName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={size.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{sze ? 'Update' : 'Add'} Size</button>
            </form>
        </Box>
    );
}

export default AddSize;

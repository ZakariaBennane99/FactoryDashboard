import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddColor({ clr }) {
    const [color, setColor] = useState({
        orderId: clr ? clr.orderId : null,
        colorName: clr ? clr.colorName : ''
    });

    const handleChange = (prop) => (event) => {
        setColor({ ...color, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(color);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color Name"
                        variant="outlined"
                        value={color.colorName}
                        onChange={handleChange('colorName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Order Id"
                        variant="outlined"
                        value={color.orderId}
                        onChange={handleChange('orderId')}
                        type='number'
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{clr ? 'Update' : 'Add'} Color</button>
            </form>
        </Box>
    );
}

export default AddColor;

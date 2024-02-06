import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddColor({ clr }) {
    const [color, setColor] = useState({
        colorName: clr ? clr.colorName : '',
        colorCode: clr ? clr.colorCode : '',
        description: clr ? clr.description : ''
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

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color Code"
                        variant="outlined"
                        value={color.colorCode}
                        onChange={handleChange('colorCode')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={color.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{clr ? 'Update' : 'Add'} Color</button>
            </form>
        </Box>
    );
}

export default AddColor;
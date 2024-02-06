import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddTemplateType({ sze }) {
    const [templateType, setTemplateType] = useState({
        orderDetailName: sze ? sze.orderDetailName : '',
        sizeName: sze ? sze.sizeName : ''
    });

    const handleChange = (prop) => (event) => {
        setTemplateType({ ...templateType, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(templateType);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Order Detail Name"
                        variant="outlined"
                        value={templateType.sizeName}
                        onChange={handleChange('orderDetailName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Size Name"
                        variant="outlined"
                        value={templateType.orderDetailName}
                        onChange={handleChange('sizeName')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{sze ? 'Update' : 'Add'} Size</button>
            </form>
        </Box>
    );
}

export default AddTemplateType;
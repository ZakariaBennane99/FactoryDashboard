import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddProductCatalogue() {

    const [productCatalogue, setProductCatalogue] = useState({
        name: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setProductCatalogue({ ...productCatalogue, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(productCatalogue);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Product Catalogue Name"
                        variant="outlined"
                        value={productCatalogue.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={productCatalogue.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-productCatalogue-btn">Add Product Catalogue</button>
            </form>
        </Box>
    );
}

export default AddProductCatalogue;

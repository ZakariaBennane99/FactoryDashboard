import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddCategoryI() {

    const [categoryI, setCategoriesI] = useState({
        name: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setCategoriesI({ ...categoryI, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(categoryI);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Category I Name"
                        variant="outlined"
                        value={categoryI.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={categoryI.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-categoryI-btn">Add Category I</button>
            </form>
        </Box>
    );
}

export default AddCategoryI;

import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddCategoryII() {

    const [categoryII, setCategoriesII] = useState({
        name: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setCategoriesII({ ...categoryII, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(categoryII);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Category II Name"
                        variant="outlined"
                        value={categoryII.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={categoryII.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-categoryII-btn">Add Category II</button>
            </form>
        </Box>
    );
}

export default AddCategoryII;

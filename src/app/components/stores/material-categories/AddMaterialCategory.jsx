import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddMaterial({ mtrlCat }) {

    const [materialCategory, setMaterial] = useState({
        name: mtrlCat ? mtrlCat.name : '',
        description: mtrlCat ? mtrlCat.description : '',
    });

    const handleChange = (prop) => (event) => {
        setMaterial({ ...materialCategory, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(materialCategory);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Category Name"
                        variant="outlined"
                        value={materialCategory.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={materialCategory.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-materialCategory-btn">{mtrlCat ? 'Update' : 'Add'} Material Category</button>
            </form>
        </Box>
    );
}

export default AddMaterial;

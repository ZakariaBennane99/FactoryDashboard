import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddTextile({ txtle }) {

    const [textile, setTextile] = useState({
        textileName: txtle ? txtle.textileName : '',
        textileType: txtle ? txtle.textileType : '',
        composition: txtle ? txtle.composition : '',
        description: txtle ? txtle.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTextile({ ...textile, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(textile);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Textile Name"
                        variant="outlined"
                        value={textile.textileName}
                        onChange={handleChange('textileName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Textile Type"
                        variant="outlined"
                        value={textile.textileType}
                        onChange={handleChange('textileType')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Composition"
                        variant="outlined"
                        value={textile.composition}
                        onChange={handleChange('composition')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={textile.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-textile-btn">{ txtle ? 'Update' : 'Add' } Textile</button>
            </form>
        </Box>
    );
}

export default AddTextile;

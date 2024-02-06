import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';

function AddMaterial({ mtrl }) {

    const [suppliers, setSuppliers] = useState([
        'Tartous Textile Solutions',
        'Raqqa Garment Makers',
        'Deir Ezzor Cloth Co.',
        'Aleppo Textiles Ltd.',
        'Damascus Fabrics Co.'
    ])

    const [material, setMaterial] = useState({
        name: mtrl ? mtrl.name : '',
        type: mtrl ? mtrl.type : '',
        color: mtrl ? mtrl.color : '',
        description: mtrl ? mtrl.description : '',
        supplier: mtrl ? mtrl.supplier : ''
    });

    const handleChange = (prop) => (event) => {
        setMaterial({ ...material, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(material);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Name"
                        variant="outlined"
                        value={material.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Type"
                        variant="outlined"
                        value={material.type}
                        onChange={handleChange('type')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color"
                        variant="outlined"
                        value={material.color}
                        onChange={handleChange('color')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={material.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="supplier-select-label">Supplier</InputLabel>
                    <Select
                        labelId="supplier-select-label"
                        id="supplier-select"
                        value={material.supplier}
                        label="Supplier"
                        onChange={handleChange('supplier')}
                        required
                    >
                        {suppliers.map((supplier, index) => (
                            <MenuItem key={index} value={supplier}>
                                {supplier}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <button type="submit" className="add-material-btn">{mtrl ? 'Update' : 'Add'} Material</button>
            </form>
        </Box>
    );
}

export default AddMaterial;

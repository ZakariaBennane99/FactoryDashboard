import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';

function AddTemplate({ tmplt }) {
    const [template, setTemplate] = useState({
        productCatalogueDetail: tmplt ? tmplt.description : '',
        templateName: tmplt ? tmplt.description : '',
        description: tmplt ? tmplt.description : '',
        fileName: tmplt ? tmplt.description : ''
    });

    // Mock product catalogue details array, replace with actual data if needed
    const productCatalogueDetails = [
        'Cotton Fabric',
        'Wool Fabric',
        'Polyester Fabric',
        // ... add other fabric types
    ];

    const handleChange = (prop) => (event) => {
        setTemplate({ ...template, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(template);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-detail-select-label">Product Catalogue Detail</InputLabel>
                    <Select
                        labelId="product-catalogue-detail-select-label"
                        id="product-catalogue-detail-select"
                        value={template.productCatalogueDetail}
                        label="Product Catalogue Detail"
                        onChange={handleChange('productCatalogueDetail')}
                        required
                    >
                        {productCatalogueDetails.map((detail, index) => (
                            <MenuItem key={index} value={detail}>
                                {detail}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Name"
                        variant="outlined"
                        value={template.templateName}
                        onChange={handleChange('TemplateName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={template.description}
                        onChange={handleChange('Description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="File Name"
                        variant="outlined"
                        value={template.fileName}
                        onChange={handleChange('FileName')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{tmplt ? 'Update' : 'Add'} Template</button>
            </form>
        </Box>
    );
}

export default AddTemplate;

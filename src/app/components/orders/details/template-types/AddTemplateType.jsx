import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddTemplateType({ tmplTypes }) {
    const [templateType, setTemplateType] = useState({
        orderDetailName: tmplTypes ? tmplTypes.orderDetailName : null,
        templateTypeName: tmplTypes ? tmplTypes.templateTypeName : ''
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
                        label="Template Type Name"
                        variant="outlined"
                        value={templateType.templateTypeName}
                        onChange={handleChange('templateTypeName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Order Detail Name"
                        variant="outlined"
                        value={templateType.orderDetailName}
                        onChange={handleChange('orderDetailName')}
                        type='number'
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{tmplTypes ? 'Update' : 'Add'} TemplateType</button>
            </form>
        </Box>
    );
}

export default AddTemplateType;

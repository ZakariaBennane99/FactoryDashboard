import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddTemplateType({ typs }) {
    const [templateType, setTemplateType] = useState({
        templateTypeName: typs ? typs.templateTypeName : '',
        description: typs ? typs.description : ''
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
                        label="Description"
                        variant="outlined"
                        value={templateType.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{typs ? 'Update' : 'Add'} Type</button>
            </form>
        </Box>
    );
}

export default AddTemplateType;

import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';

function AddTemplatePattern({ ptrn }) {
    const [templatePattern, setTemplatePattern] = useState({
        templatePatternName: ptrn ? ptrn.templatePatternName : '',
        description: ptrn ? ptrn.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTemplatePattern({ ...templatePattern, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(templatePattern);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Type Name"
                        variant="outlined"
                        value={templatePattern.templatePatternName}
                        onChange={handleChange('templatePatternName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={templatePattern.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{ptrn ? 'Update' : 'Add'} Pattern</button>
            </form>
        </Box>
    );
}

export default AddTemplatePattern;

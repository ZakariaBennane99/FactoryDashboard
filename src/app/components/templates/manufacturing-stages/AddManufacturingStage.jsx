import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AddManufacturingStage({ mnfStage }) {
    const [manufacturingStage, setManufacturingStage] = useState({
        stageNumber: mnfStage ? mnfStage.stageNumber : '',
        stageName: mnfStage ? mnfStage.stageName : '',
        workDescription: mnfStage ? mnfStage.workDescription : '',
        duration: mnfStage ? mnfStage.duration : '',
        description: mnfStage ? mnfStage.description : '',
        template: mnfStage ? mnfStage.template : '',
        department: mnfStage ? mnfStage.department : ''
    });

    const templates = ['Basic Tee', 'Classic Jeans', 'Summer Dress'];
    const departments = [
        'Engineering Office', 'Finance Office', 'Accounting Office',
        'Production Plant 1', 'Cutting Division'
    ];

    const handleChange = (prop) => (event) => {
        setManufacturingStage({ ...manufacturingStage, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(manufacturingStage);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Stage Number"
                        variant="outlined"
                        type="number"
                        value={manufacturingStage.stageNumber}
                        onChange={handleChange('stageNumber')}
                        required
                        inputProps={{ min: 1 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Stage Name"
                        variant="outlined"
                        value={manufacturingStage.stageName}
                        onChange={handleChange('stageName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Work Description"
                        variant="outlined"
                        value={manufacturingStage.workDescription}
                        onChange={handleChange('workDescription')}
                        required
                        multiline
                        rows={2}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Duration (minutes)"
                        variant="outlined"
                        type="number"
                        value={manufacturingStage.duration}
                        onChange={handleChange('duration')}
                        required
                        inputProps={{ min: 1 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={manufacturingStage.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={2}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-select-label">Template</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        value={manufacturingStage.template}
                        label="Template"
                        onChange={handleChange('template')}
                        required
                    >
                        {templates.map((template, index) => (
                            <MenuItem key={index} value={template}>
                                {template}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                        labelId="department-select-label"
                        id="department-select"
                        value={manufacturingStage.department}
                        label="Department"
                        onChange={handleChange('department')}
                        required
                    >
                        {departments.map((department, index) => (
                            <MenuItem key={index} value={department}>
                                {department}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">
                    {mnfStage ? 'Update' : 'Add'} Manufacturing Stage
                </button>
            </form>
        </Box>
    );
}

export default AddManufacturingStage;

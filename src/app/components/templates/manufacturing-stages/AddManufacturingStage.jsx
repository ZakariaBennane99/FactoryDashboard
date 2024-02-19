import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function AddManufacturingStage({ mnfStage }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [manufacturingStage, setManufacturingStage] = useState({
        stageNumber: mnfStage ? mnfStage.stageNumber : '',
        stageName: mnfStage ? mnfStage.stageName : '',
        workDescription: mnfStage ? mnfStage.workDescription : '',
        duration: mnfStage ? mnfStage.duration : '',
        description: mnfStage ? mnfStage.description : '',
        template: mnfStage ? mnfStage.template : '',
        department: mnfStage ? mnfStage.department : ''
    });

    const [templates, setTemplates] = useState(['Basic Tee', 'Classic Jeans', 'Summer Dress'])
    const [departments, setDepartments] = useState(['Engineering Office', 'Finance Office', 
    'Accounting Office', 'Production Plant 1', 'Cutting Division'])


    const handleChange = (prop) => (event) => {
        setManufacturingStage({ ...manufacturingStage, [prop]: event.target.value });
    };

    function showMsg(msg, status) {
    
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg, // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: status // success error info warning null
        })), 100);
    }

    const handleAddManufacturingStages = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/manufacturingStages
            // @description: create a new manufacturingStage
            const res = await jwtService.createItem({ 
                itemType: 'manufacturingStages',
                data: {
                    data: manufacturingStage,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                showMsg(res, 'success')
            }
        } catch (_error) {
            showMsg(_error, 'error')
        } 
    };


    const handleUpdateManufacturingStages = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/manufacturingStages
            // @description: update an existing manufacturingStage
            const res = await jwtService.updateItem({ 
                itemType: 'manufacturingStages',
                data: {
                    data: manufacturingStage,
                    currentUserId: currentUserId,
                    itemId: mnfStage.manufacturingStagesId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };

    
    /* TO BE UNCOMMENTED IN PRODUCTION
    // get the list of existing departments and templates
    useEffect(() => {    
        async function getDepartmentsAndTemplates() {
            try {
                // @route: api/departmentsAndTemplates
                // @description: get Departments and Templates
                // @response: return an object of two arrays one named templates 
				// the other, departments within which each elements has
				// an id and it's name
                const res = await jwtService.getDepartmentsAndTemplates({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setDepartments(res.departments)
                    setTemplates(res.templates)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getDepartsAndTemplates();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mnfStage ? handleUpdateManufacturingStages : handleAddManufacturingStages}>

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

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
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

                <button type="submit" className="add-internalOrder-btn">
                    {mnfStage ? 'Update' : 'Add'} Manufacturing Stage
                </button>
            </form>
        </Box>
    );
}

export default AddManufacturingStage;

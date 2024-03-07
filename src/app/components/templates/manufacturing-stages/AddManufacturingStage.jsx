import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';






function AddManufacturingStage({ mnfStage }) {

    const { t, i18n } = useTranslation('manufacturingStagesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [manufacturingStage, setManufacturingStage] = useState({
        id: mnfStage ? mnfStage.id : '',
        stageNumber: mnfStage ? mnfStage.stageNumber : '',
        stageName: mnfStage ? mnfStage.stageName : '',
        workDescription: mnfStage ? mnfStage.workDescription : '',
        duration: mnfStage ? mnfStage.duration : '',
        description: mnfStage ? mnfStage.description : '',
        template: mnfStage ? mnfStage.template : '',
        department: mnfStage ? mnfStage.department : ''
    });


    const [templates, setTemplates] = useState([])
    const [departments, setDepartments] = useState([])

    const handleChange = (prop) => (event) => {
        if (prop === 'template') {
            const tmple = templates.find(supplier => supplier.id === event.target.value);
            setManufacturingStage({ ...manufacturingStage, [prop]: tmple });
        } else if (prop === 'department') {
            const tmple = departments.find(supplier => supplier.id === event.target.value);
            setManufacturingStage({ ...manufacturingStage, [prop]: tmple });
        } else {
            setManufacturingStage({ ...manufacturingStage, [prop]: event.target.value });
        }
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
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'manufacturingstage',
                data: manufacturingStage
            }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };


    const handleUpdateManufacturingStages = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'manufacturingstage',
                data: {
                    data: manufacturingStage,
                    itemId: mnfStage.id
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {    
        async function getSuppliersNames() {
            try {
                const res = await jwtService.getItemNames(['template', 'department']);
                if (res) {
                    const departs = res[1].data.filter(depart => depart.name !== 'Engineering Office')
                    setTemplates(res[0].data)
                    setDepartments(departs)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getSuppliersNames();
    }, []);




    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mnfStage ? handleUpdateManufacturingStages : handleAddManufacturingStages}>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-select-label">{t('TEMPLATE')}</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        value={manufacturingStage.template ? manufacturingStage.template.id : ''}
                        label={t('TEMPLATE')}
                        onChange={handleChange('template')}
                        required
                    >
                        {templates.map((template, index) => (
                            <MenuItem key={template.id} value={template.id}>
                                {template.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('STAGE_NUMBER')}
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
                        label={t('STAGE_NAME')}
                        variant="outlined"
                        value={manufacturingStage.stageName}
                        onChange={handleChange('stageName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="department-select-label">{t('DEPARTMENT')}</InputLabel>
                    <Select
                        labelId="department-select-label"
                        id="department-select"
                        value={manufacturingStage.department ? manufacturingStage.department.id : ''}
                        label={t('DEPARTMENT')}
                        onChange={handleChange('department')}
                        required
                    >
                        {departments.map((department, index) => (
                            <MenuItem key={department.id} value={department.id}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('WORK_DESCRIPTION')}
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
                        label={t('DURATION_MINUTES')}
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
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={manufacturingStage.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={2}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                {mnfStage ? (isLoading ? t('UPDATING') : t('UPDATE_MANUFACTURING_STAGE_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_MANUFACTURING_STAGE_BUTTON'))}
                </button>
            </form>
        </Box>
    );
}

export default AddManufacturingStage;

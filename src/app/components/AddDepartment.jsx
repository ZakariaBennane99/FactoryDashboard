import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';
import { useTranslation } from 'react-i18next';
import { indexOf } from 'lodash';



function AddDepartment({ dprt }) {

    const { t, i18n } = useTranslation('departmentsPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useAppDispatch()

    function showMsg(msg, status) {
        // take the itemId, and delete the item
    
        // then close the dialog, and show a quick message
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

    const [managers, setManagers] = useState([])

    const categories = ['MANAGEMENT', 'PRODUCTION', 'SERVICES'];
    const categoriesAr = ['الإدارة', 'الإنتاج', 'الخدمات'];

    const [department, setDepartment] = useState({
        departmentId: dprt ? dprt.id : '',
        name: dprt ? dprt.name : '',
        manager: dprt ? dprt.manager : '',
        category: dprt ? dprt.category : '',
        description: dprt ? dprt.description : ''
    });

    const handleChange = (prop) => (event) => {
        if (prop === 'manager') {
            setDepartment({
                ...department,
                [prop]: {
                    ...department.manager,
                    id: event.target.value,
                    name: managers.find(manager => manager.id === event.target.value).name
                }
            });
        } else {
            setDepartment({ ...department, [prop]: event.target.value });
        }
    };

    const handleUpdateDepart = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true)
            const res = await jwtService.updateItem({ 
                itemType: 'department',
                data: {
                    data: department,
                    itemId: department.departmentId
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                showMsg(res.message, 'success')
            }
        } catch (err) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(err.message, 'error');
        } finally {
            setIsLoading(false)
        }

    };

    const handleAddDepart = async (event) => {
        event.preventDefault();
        if (lang === 'ar') {
            setDepartment({ ...department, 
                category: categories[categoriesAr.indexOf(department.category)] })
        }

        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'department',
                data: department
             }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
                showMsg(res.message, 'success')
            }
        } catch (err) {
            showMsg(err.message, 'error');
        } finally {
            setIsLoading(false)
        }
    };


    // get existing unassigned managers who have user roles other than 'Warehouse Manager'
    useEffect(() => {    
        async function getManagers() {
            try {
                // @route: api/managers
                // @description: get Managers
                const res = await jwtService.getManagers();
                if (res.status === 200) {
                    setManagers(res.data.filter(manager => manager.Role !== 'STOREMANAGER').map(manager => ({
                        id: manager.Id,
                        name: `${manager.Firstname.charAt(0).toUpperCase() + manager.Firstname.slice(1)} ${manager.Lastname.charAt(0).toUpperCase() + manager.Lastname.slice(1)}`
                    })));
                }
            } catch (error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(error.message, 'error')
            }
        }
        
        getManagers();
    }, []);


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dprt ? handleUpdateDepart : handleAddDepart}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('DEPARTMENT_NAME')}
                        variant="outlined"
                        value={department.name}
                        onChange={handleChange('name')}
                        required={!dprt}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" >
                    <InputLabel id="manager-label">{t('MANAGER_LABEL')}</InputLabel>
                    <Select
                        labelId={t('MANAGER_LABEL')}
                        value={department.manager ? department.manager.id : ''}
                        label="Manager"
                        onChange={handleChange('manager')}
                        required={!dprt}
                    >
                        {managers.map((manager) => (
                            <MenuItem key={manager.id} value={manager.id}>
                                {manager.name}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">{t('CATEGORY_LABEL')}</InputLabel>
                    <Select
                        labelId={t('CATEGORY_LABEL')}
                        value={lang === 'ar' ? categoriesAr[categories.indexOf(department.category)] : department.category}
                        label="Category"
                        onChange={handleChange('category')}
                        required={!dprt}
                    >
                        { lang === 'ar' ?
                         categoriesAr.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        )) :
                        categories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION_LABEL')}
                        multiline
                        rows={4}
                        value={department.description}
                        onChange={handleChange('description')}
                        variant="outlined"
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {dprt ? (isLoading ? t('UPDATING') : t('UPDATE_DEPARTMENT_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_DEPARTMENT_BUTTON')) }
                </button>
            </form>
        </Box>
    );
}

export default AddDepartment;

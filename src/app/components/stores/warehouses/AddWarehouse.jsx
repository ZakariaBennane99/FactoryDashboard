import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'app/store';



function AddWarehouse({ wrhouse }) {

    const { t, i18n } = useTranslation('warehousesPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false)

    const [managers, setManagers] = useState([])

    const dispatch = useAppDispatch()

    const [warehouse, setWarehouse] = useState({
        id: wrhouse ? wrhouse.id : '',
        name: wrhouse ? wrhouse.name : '',
        location: wrhouse ? wrhouse.location : '',
        capacity: wrhouse ? wrhouse.capacity : '',
        manager: wrhouse ? wrhouse.manager : ''
    });

    const handleChange = (prop) => (event) => {
        if (prop === 'manager') {
            setWarehouse({
                ...warehouse,
                [prop]: {
                    ...warehouse.manager,
                    id: event.target.value,
                    name: managers.find(manager => manager.id === event.target.value).name
                }
            });
        } else {
            setWarehouse({ ...warehouse, [prop]: event.target.value });
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

    const handleAddWarehouses = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'warehouse',
                data: warehouse
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

    const handleUpdateWarehouses = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            // @route: api/update/warehouses
            // @description: update an existing warehouse
            const res = await jwtService.updateItem({ 
                itemType: 'warehouse',
                data: {
                    data: warehouse,
                    itemId: warehouse.id
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
        async function getManagers() {
            try {
                const res = await jwtService.getManagers();
                if (res.status === 200) {
                    setManagers(res.data.map(manager => ({
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
            <form onSubmit={wrhouse ? handleUpdateWarehouses : handleAddWarehouses}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('WAREHOUSE_NAME')}
                        variant="outlined"
                        value={warehouse.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('WAREHOUSE_LOCATION')}
                        variant="outlined"
                        value={warehouse.location}
                        onChange={handleChange('location')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('WAREHOUSE_CAPACITY')}
                        variant="outlined"
                        type="number"
                        value={warehouse.capacity}
                        onChange={handleChange('capacity')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{ min: 0 }} // Prevents negative numbers
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="manager-label">{t('MANAGER_LABEL')}</InputLabel>
                    <Select
                        labelId="manager-label"
                        value={warehouse.manager ? warehouse.manager.id : ''}
                        label={t('MANAGER_LABEL')}
                        onChange={handleChange('manager')}
                        required
                    >
                        {managers.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>


                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {wrhouse ? (isLoading ? t('UPDATING') : t('UPDATE_WAREHOUSE')) : (isLoading ? t('ADDING') : t('ADD_WAREHOUSE_BUTTON')) }
                </button>
            </form>
        </Box>
    );
}

export default AddWarehouse;

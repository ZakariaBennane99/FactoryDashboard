import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddWarehouse({ wrhouse }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [managers, setManagers] = useState([
        'Moha Itani',
        'Alfered Maha',
        'Istovav Monk'
    ])

    const [warehouse, setWarehouse] = useState({
        name: wrhouse ? wrhouse.name : '',
        location: wrhouse ? wrhouse.location : '',
        capacity: wrhouse ? wrhouse.capacity : '',
        manager: wrhouse ? wrhouse.manager : ''
    });

    const handleChange = (prop) => (event) => {
        setWarehouse({ ...warehouse, [prop]: event.target.value });
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
        
        try {
            // @route: api/create/warehouses
            // @description: create a new warehouse
            const res = await jwtService.createItem({ 
                itemType: 'warehouses',
                data: {
                    data: warehouse,
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

    const handleUpdateWarehouses = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/warehouses
            // @description: update an existing warehouse
            const res = await jwtService.updateItem({ 
                itemType: 'warehouses',
                data: {
                    data: warehouse,
                    currentUserId: currentUserId,
                    itemId: wrhouse.warehousesId
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
    // get the names of manager who have the roles of "Warehouse Manager" 
    // who haven't been assigned to any department 
    useEffect(() => {    
        async function getManagersNames() {
            try {
                // @route: api/managerNames
                // @description: get Manager Names 
                // @response: an array of existing manager Names
                const res = await jwtService.getManagersNames({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setManagers(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getManagersNames();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={wrhouse ? handleUpdateWarehouses : handleAddWarehouses}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Warehouse Name"
                        variant="outlined"
                        value={warehouse.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Location"
                        variant="outlined"
                        value={warehouse.location}
                        onChange={handleChange('location')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Capacity"
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
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        value={warehouse.manager}
                        label="Manager"
                        onChange={handleChange('manager')}
                        required
                    >
                        {managers.map((manager, index) => (
                            <MenuItem key={index} value={manager}>
                                {manager}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <button type="submit" className="add-warehouse-btn">{wrhouse ? 'Update' : 'Add'} Warehouse</button>
            </form>
        </Box>
    );
}

export default AddWarehouse;

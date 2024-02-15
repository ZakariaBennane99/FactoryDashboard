import React from 'react';
import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';


function AddDepartment({ dprt }) {

    const currentUserId = window.localStorage.getItem('userId')

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

    const [managers, setManagers] = useState(['Chris Evans', 'Marly Manson', 'Tim Bergling', 'Hamid Abdelhamid',
'Sam Kfouri', 'Omar Akil', 'Mohammed Atouani', 'Mouad Moutaouakil', 'Chris Tucker'])

    const [department, setDepartment] = useState({
        name: dprt ? dprt.name : '',
        manager: dprt ? dprt.manager : '',
        category: dprt ? dprt.category : '',
        description: dprt ? dprt.description : ''
    });

    const handleChange = (prop) => (event) => {
        setDepartment({ ...department, [prop]: event.target.value });
    };

    const handleUpdateDepart = async (event) => {
        event.preventDefault();
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'department',
                data: {
                    data: department,
                    currentUserId: currentUserId,
                    itemId: department.departmentId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('User has been successfully updated!', 'success');
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('User update failed. Please try again.', 'error');
        }

    };

    const handleAddDepart = async (event) => {
        event.preventDefault();
        try {
            const res = await jwtService.createItem({ 
                itemType: 'department',
                data: {
                    data: department,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('User has been successfully updated!', 'success');
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('User update failed. Please try again.', 'error');
        }

    };

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

    /* TO BE UNCOMMENTED IN PRODUCTION
    // get existing managers
    useEffect(() => {    
        async function getManagers() {
            try {
                // @route: api/managers
                // @description: get Managers
                const res = await jwtService.getManagers({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setManagers(res.departs)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            }
        }
        
        getManagers();
    }, []);*/


    
    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dprt ? handleUpdateDepart : handleAddDepart}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Department Name"
                        variant="outlined"
                        value={department.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        value={department.manager.split(" ").join("").toLocaleLowerCase()}
                        label="Manager"
                        onChange={handleChange('manager')}
                        required
                    >
                        {
                            managers.map(manager => <MenuItem value={manager.replace(/\s+/g, '').toLowerCase()}>{manager}</MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={department.category}
                        label="Category"
                        onChange={handleChange('category')}
                        required
                    >
                        <MenuItem value={'Management'}>Management</MenuItem>
                        <MenuItem value={'Production'}>Production</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        value={department.description}
                        onChange={handleChange('description')}
                        variant="outlined"
                        required
                    />
                </FormControl>

                <button type="submit" className="add-depart-btn">{dprt ? 'Update' : 'Add' } Department</button>
            </form>
        </Box>
    );
}

export default AddDepartment;

import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
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

    const [managers, setManagers] = useState([])

    const [categories, setCategories] = useState(['Management', 'Production', 'Services'])

    const [department, setDepartment] = useState({
        departmentId: dprt.id,
        name: dprt ? dprt.name : '',
        managerId: dprt ? dprt.manager : '',
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
                    itemId: department.departmentId
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                showMsg(res.message, 'success');
            }
        } catch (err) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(err.message, 'error');
        }

    };

    const handleAddDepart = async (event) => {
        event.preventDefault();
        try {
            const res = await jwtService.createItem({ 
                itemType: 'department',
                data: department
             }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
                showMsg(res.message, 'success');
            }
        } catch (err) {
            showMsg(err.message, 'error');
        }
    };


    // get existing unassigned managers who have user roles other than 'Warehouse Manager'
    useEffect(() => {    
        async function getManagers() {
            try {
                // @route: api/managers
                // @description: get Managers
                const res = await jwtService.getManagers();
                if (res) {
                    setManagers(res.data.map(manager => ({
                        id: manager.Id,
                        fullName: `${manager.Firstname.charAt(0).toUpperCase() + manager.Firstname.slice(1)} ${manager.Lastname.charAt(0).toUpperCase() + manager.Lastname.slice(1)}`
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
                            managers.map(manager => (
                                <MenuItem key={manager.id} value={manager.id}>{manager.fullName}</MenuItem>
                            ))
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
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
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
                    />
                </FormControl>

                <button type="submit" className="add-depart-btn">{dprt ? 'Update' : 'Add' } Department</button>
            </form>
        </Box>
    );
}

export default AddDepartment;

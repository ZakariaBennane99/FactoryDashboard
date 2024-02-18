import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddMaterial({ mtrl }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [suppliers, setSuppliers] = useState([])

    const [material, setMaterial] = useState({
        name: mtrl ? mtrl.name : '',
        type: mtrl ? mtrl.type : '',
        color: mtrl ? mtrl.color : '',
        description: mtrl ? mtrl.description : '',
        supplier: mtrl ? mtrl.supplier : ''
    });

    const handleChange = (prop) => (event) => {
        setMaterial({ ...material, [prop]: event.target.value });
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

    const handleAddMaterials = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/materials
            // @description: create a new material
            const res = await jwtService.createItem({ 
                itemType: 'materials',
                data: {
                    data: material,
                    currentUserId: currentUserId
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

    const handleUpdateMaterials = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/materials
            // @description: update existing material
            const res = await jwtService.updateItem({ 
                itemType: 'materials',
                data: {
                    data: material,
                    currentUserId: currentUserId,
                    itemId: mtrl.materialsId
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
    // get existing suppliers Names
    useEffect(() => {    
        async function getSuppliersNames() {
            try {
                // @route: api/supplierNames
                // @description: get Supplier Names 
                // @response: an array of existing supplier Names
                const res = await jwtService.getSupplierNames({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setSuppliers(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getSuppliersNames();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mtrl ? handleUpdateMaterials : handleAddMaterials}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Name"
                        variant="outlined"
                        value={material.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Material Type"
                        variant="outlined"
                        value={material.type}
                        onChange={handleChange('type')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Color"
                        variant="outlined"
                        value={material.color}
                        onChange={handleChange('color')}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel id="supplier-select-label">Supplier</InputLabel>
                    <Select
                        labelId="supplier-select-label"
                        id="supplier-select"
                        value={material.supplier}
                        label="Supplier"
                        onChange={handleChange('supplier')}
                        required
                    >
                        {suppliers.map((supplier, index) => (
                            <MenuItem key={index} value={supplier}>
                                {supplier}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={material.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-material-btn">{mtrl ? 'Update' : 'Add'} Material</button>
            </form>
        </Box>
    );
}

export default AddMaterial;

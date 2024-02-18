import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddMaterialMovement({ mtrlMovement }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [materialNames, setMaterialNames] = useState([])

    const [materialMovement, setMaterialMovement] = useState({
        materialName: mtrlMovement ? mtrlMovement.materialName : '',
        from: mtrlMovement ? mtrlMovement.from : '',
        to: mtrlMovement ? mtrlMovement.to : '',
        movementType: mtrlMovement ? mtrlMovement.movementType : '',
        quantity: mtrlMovement ? mtrlMovement.quantity : 0,
        unitOfMeasure: mtrlMovement ? mtrlMovement.unitOfMeasure : '',
        status: mtrlMovement ? mtrlMovement.status : '',
        notes: mtrlMovement ? mtrlMovement.notes : ''
    });

    const fromOptions = ['Supplier', 'Department', 'Warehouse'];
    const toOptions = materialMovement.from === 'Department' ? ['Warehouse'] : ['Department', 'Warehouse'];

    const movementTypes = ['INCOMING', 'OUTGOING', 'TRANSFER', 'RETURN'];
    const statuses = ['REJECTED', 'APPROVED', 'PENDING', 'FULFILLED', 'CANCELLED', 'COMPLETED', 'ONGOING'];

    const handleChange = (prop) => (event) => {
        setMaterialMovement({ ...materialMovement, [prop]: event.target.value });
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


    const handleAddMaterialMovements = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/materialMovements
            // @description: create a new material movement
            const res = await jwtService.createItem({ 
                itemType: 'materialMovements',
                data: {
                    data: materialMovement,
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

    const handleUpdateMaterialMovements = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/materialMovements
            // @description: update existing material movement
            const res = await jwtService.updateItem({ 
                itemType: 'materialMovements',
                data: {
                    data: materialMovement,
                    currentUserId: currentUserId,
                    itemId: mtrlMovement.materialMovementsId
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
    // get existing material Names
    useEffect(() => {    
        async function getMaterialNames() {
            try {
                // @route: api/materialNames
                // @description: get Material Names 
                // @response: an array named "materials" of existing material Names
                const res = await jwtService.getMaterialNames({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setMaterialNames(res.materials)
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            }
        }
        
        getMaterialNames();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={txtle ? handleUpdateMaterialMovements : handleAddMaterialMovements}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="material-name-label">Material Name</InputLabel>
                    <Select
                        labelId="material-name-label"
                        id="material-name"
                        value={materialMovement.materialName}
                        label="Material Name"
                        onChange={handleChange('materialName')}
                        required
                    >
                        {materialNames.map((material, index) => (
                            <MenuItem key={index} value={material}>
                                {material}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="from-label">From</InputLabel>
                    <Select
                        labelId="from-label"
                        id="from"
                        value={materialMovement.from}
                        label="From"
                        onChange={handleChange('from')}
                        required
                    >
                        {fromOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {materialMovement.from && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="to-label">To</InputLabel>
                        <Select
                            labelId="to-label"
                            id="to"
                            value={materialMovement.to}
                            label="To"
                            onChange={handleChange('to')}
                            required
                        >
                            {toOptions.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel id="movement-type-label">Movement Type</InputLabel>
                    <Select
                        labelId="movement-type-label"
                        id="movement-type"
                        value={materialMovement.movementType}
                        label="Movement Type"
                        onChange={handleChange('movementType')}
                        required
                    >
                        {movementTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Quantity"
                        variant="outlined"
                        type="number"
                        value={materialMovement.quantity}
                        onChange={handleChange('quantity')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Unit of Measure"
                        variant="outlined"
                        value={materialMovement.unitOfMeasure}
                        onChange={handleChange('unitOfMeasure')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={materialMovement.status}
                        label="Status"
                        onChange={handleChange('status')}
                        required
                    >
                        {statuses.map((status, index) => (
                            <MenuItem key={index} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Notes"
                        variant="outlined"
                        value={materialMovement.notes}
                        onChange={handleChange('notes')}
                        multiline
                        rows={2}
                    />
                </FormControl>

                <button type="submit" className="add-materialMovement-btn">{mtrlMovement ? 'Update' : 'Add'} Material Movement</button>
            </form>
        </Box>
    );
}

export default AddMaterialMovement;

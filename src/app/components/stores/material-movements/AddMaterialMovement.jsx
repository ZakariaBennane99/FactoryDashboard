import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel, Button } from '@mui/material';

function AddMaterialMovement() {
    const [materialMovement, setMaterialMovement] = useState({
        materialName: '',
        from: '',
        to: '',
        movementType: '',
        quantity: 0,
        unitOfMeasure: '',
        status: '',
        notes: ''
    });

    const materials = [
        'Cotton Fabric',
        'Polyester Yarn',
        'Woolen Thread',
        // ... other materials
    ];

    const fromOptions = ['Supplier', 'Department', 'Warehouse'];
    const toOptions = materialMovement.from === 'Department' ? ['Warehouse'] : ['Department', 'Warehouse'];

    const movementTypes = ['INCOMING', 'OUTGOING', 'TRANSFER', 'RETURN'];
    const statuses = ['Rejected', 'Approved', 'Pending', 'Fulfilled', 'Cancelled', 'Completed', 'Ongoing'];

    const handleChange = (prop) => (event) => {
        setMaterialMovement({ ...materialMovement, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(materialMovement);
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>
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
                        {materials.map((material, index) => (
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

                <button type="submit" className="add-materialMovement-btn">Add Material Movement</button>
            </form>
        </Box>
    );
}

export default AddMaterialMovement;

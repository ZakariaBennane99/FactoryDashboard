import { useState } from 'react';
import { FormControl, TextField, Box, InputLabel, Select, MenuItem,  } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../auth/services/jwtService';


function AddModel({ mdl }) {

    const dispatch = useAppDispatch()

    // this will host an object of arrays for orderIds, templateTypeIds, colors
    // and sizes to be fetched from the backend
    const [modelExistingData, setModelExistingData] = useState()

    const currentUserId = window.localStorage.getItem('userId')

    const [model, setModel] = useState({
        orderId: mdl ? mdl.orderId : '',
        modelNumber: mdl ? mdl.modelId : null,
        modelName: mdl ? mdl.modelName : 0,
        templateType: mdl ? mdl.templateType : '',
        color: mdl ? mdl.color : '',
        size: mdl ? mdl.size : '',
        quantity: mdl ? mdl.quantity : '',
        quantityDetails: mdl ? mdl.quantityDetails : '',
        notes: mdl ? mdl.notes : ''
    });

    const handleChange = (prop) => (event) => {
        setModel({ ...model, [prop]: event.target.value });
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

    const handleAddModel = async (event) => {
        event.preventDefault();

        try {
            // @route: api/create/model
            // @description: create a new model
            const res = await jwtService.createItem({ 
                itemType: 'model',
                data: {
                    data: model,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('Model has been successfully created!', 'success')
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('Model creation failed. Please try again.!', 'error')
        }  
    };

    const handleUpdateModel = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/model
            // @description: update an existing model
            const res = await jwtService.updateItem({ 
                itemType: 'model',
                data: {
                    data: model,
                    currentUserId: currentUserId,
                    itemId: model.modelId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg('Model has been successfully Updated!', 'success')
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg('Updating model failed. Please try again.!', 'error')
        }  
        
    };

    const orderIds = [
        123, 41234, 12341, 2135
    ]

    const templateTypeIds = [
        123, 41234, 12341, 2135
    ]

    const colors = [
        "Red", "White", "Blue", "Black"
    ]

    const sizes = [
        "XL", "L", "M", "S"
    ]

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={mdl ? handleUpdateModel : handleAddModel}>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-name-select-label">Order Id</InputLabel>
                        <Select
                            labelId="model-name-select-label"
                            id="model-name-select"
                            value={model.orderId}
                            label="Order Id"
                            onChange={handleChange('orderId')}
                            required
                        >
                            {orderIds.map((name, index) => (
                                <MenuItem key={index} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Model Number"
                            variant="outlined"
                            type="string"
                            value={model.modelNumber}
                            onChange={handleChange('modelNumber')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Model Name"
                            variant="outlined"
                            type="string"
                            value={model.modelName}
                            onChange={handleChange('modelName')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-name-select-label">Template Type</InputLabel>
                        <Select
                            labelId="model-name-select-label"
                            id="model-name-select"
                            value={model.orderId}
                            label="Template Type"
                            onChange={handleChange('templateType')}
                            required
                        >
                            {templateTypeIds.map((name, index) => (
                                <MenuItem key={index} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-name-select-label">Color</InputLabel>
                        <Select
                            labelId="model-name-select-label"
                            id="model-name-select"
                            value={model.color}
                            label="Color"
                            onChange={handleChange('color')}
                            required
                        >
                            {colors.map((name, index) => (
                                <MenuItem key={index} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-name-select-label">Size</InputLabel>
                        <Select
                            labelId="model-name-select-label"
                            id="model-name-select"
                            value={model.size}
                            label="Size"
                            onChange={handleChange('size')}
                            required
                        >
                            {sizes.map((name, index) => (
                                <MenuItem key={index} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={model.quantity}
                            onChange={handleChange('quantity')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Quantity Details"
                            variant="outlined"
                            type="string"
                            value={model.quantityDetails}
                            onChange={handleChange('quantityDetails')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label="Notes"
                            variant="outlined"
                            type="string"
                            value={model.notes}
                            onChange={handleChange('notes')}
                            required
                        />
                    </FormControl>


                    <button type="submit" className="add-user-btn">
                        {mdl ? 'Update' : 'Add'} Model
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddModel;

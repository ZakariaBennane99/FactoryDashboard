import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddTemplateType({ typs }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [templateType, setTemplateType] = useState({
        templateTypeName: typs ? typs.templateTypeName : '',
        description: typs ? typs.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTemplateType({ ...templateType, [prop]: event.target.value });
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

    const handleAddTypes = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/types
            // @description: create a new type
            const res = await jwtService.createItem({ 
                itemType: 'types',
                data: {
                    data: templateType,
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

    const handleUpdateTypes = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/types
            // @description: update an existing type
            const res = await jwtService.updateItem({ 
                itemType: 'types',
                data: {
                    data: templateType,
                    currentUserId: currentUserId,
                    itemId: typs.typeId
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


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={typs ? handleUpdateTypes : handleAddTypes}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Type Name"
                        variant="outlined"
                        value={templateType.templateTypeName}
                        onChange={handleChange('templateTypeName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={templateType.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{typs ? 'Update' : 'Add'} Type</button>
            </form>
        </Box>
    );
}

export default AddTemplateType;

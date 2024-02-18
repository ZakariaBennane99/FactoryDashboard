import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../../app/auth/services/jwtService'
import { showMessage } from 'app/store/fuse/messageSlice';


function AddTemplateType({ tmplTypes }) {

    const currentUserId = window.localStorage.getItem('userId')

    const [templateType, setTemplateType] = useState({
        orderDetailName: tmplTypes ? tmplTypes.orderDetailName : null,
        templateTypeName: tmplTypes ? tmplTypes.templateTypeName : ''
    });

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

    const handleChange = (prop) => (event) => {
        setTemplateType({ ...templateType, [prop]: event.target.value });
    };

    const handleAddTemplateType = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/templatesType
            // @description: create a new templatesType
            const res = await jwtService.createItem({ 
                itemType: 'templatesType',
                data: {
                    data: templateType,
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

    const handleUpdateTemplateType = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/templatesType
            // @description: update templates Size
            const res = await jwtService.updateItem({ 
                itemType: 'templatesType',
                data: {
                    data: modelSize,
                    currentUserId: currentUserId,
                    itemId: tmplTypes.templateTypeId
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
            <form onSubmit={ tmplTypes ? handleUpdateTemplateType : handleAddTemplateType }>
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
                        label="Order Detail Name"
                        variant="outlined"
                        value={templateType.orderDetailName}
                        onChange={handleChange('orderDetailName')}
                        required
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{tmplTypes ? 'Update' : 'Add'} Template Type</button>
            </form>
        </Box>
    );
}

export default AddTemplateType;

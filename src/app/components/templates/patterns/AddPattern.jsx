import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddTemplatePattern({ ptrn }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [templatePattern, setTemplatePattern] = useState({
        templatePatternName: ptrn ? ptrn.templatePatternName : '',
        description: ptrn ? ptrn.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTemplatePattern({ ...templatePattern, [prop]: event.target.value });
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

    const handleAddPatterns = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/patterns
            // @description: create a new pattern
            const res = await jwtService.createItem({ 
                itemType: 'patterns',
                data: {
                    data: templatePattern,
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

    const handleUpdatePatterns = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/patterns
            // @description: update an existing pattern
            const res = await jwtService.updateItem({ 
                itemType: 'patterns',
                data: {
                    data: templatePattern,
                    currentUserId: currentUserId,
                    itemId: ptrn.patternId
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
            <form onSubmit={ptrn ? handleUpdatePatterns : handleAddPatterns}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Type Name"
                        variant="outlined"
                        value={templatePattern.templatePatternName}
                        onChange={handleChange('templatePatternName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={templatePattern.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{ptrn ? 'Update' : 'Add'} Pattern</button>
            </form>
        </Box>
    );
}

export default AddTemplatePattern;

import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';




function AddTemplatePattern({ ptrn }) {

    const { t, i18n } = useTranslation('patternsPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [templatePattern, setTemplatePattern] = useState({
        id: ptrn ? ptrn.id : '', 
        name: ptrn ? ptrn.name : '',
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
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'templatepattern',
                data: templatePattern
             }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };

    const handleUpdatePatterns = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/patterns
            // @description: update an existing pattern
            const res = await jwtService.updateItem({ 
                itemType: 'templatepattern',
                data: {
                    data: templatePattern,
                    itemId: templatePattern.id
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };
    

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={ptrn ? handleUpdatePatterns : handleAddPatterns}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('TEMPLATE_PATTERN_NAME')}
                        variant="outlined"
                        value={templatePattern.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={templatePattern.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {ptrn ? (isLoading ? t('UPDATING') : t('UPDATE_TEMPLATE_PATTERN')) : (isLoading ? t('ADDING') : t('ADD_PATTERN'))}
                </button>
            </form>
        </Box>
    );
}

export default AddTemplatePattern;

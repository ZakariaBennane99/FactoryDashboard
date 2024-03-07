import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';





function AddTemplateType({ typs }) {

    const { t, i18n } = useTranslation('typesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [templateType, setTemplateType] = useState({
        id: typs ? typs.id : '',
        name: typs ? typs.name : '',
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
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'templatetype',
                data: templateType
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

    const handleUpdateTypes = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/templateTypes
            // @description: update an existing template Type type
            const res = await jwtService.updateItem({ 
                itemType: 'templatetype',
                data: {
                    data: templateType,
                    itemId: templateType.id
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
            <form onSubmit={typs ? handleUpdateTypes : handleAddTypes}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('TEMPLATE_TYPE_NAME')}
                        variant="outlined"
                        value={templateType.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={templateType.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {typs ? (isLoading ? t('UPDATING') : t('UPDATE_TEMPLATE_TYPE')) : (isLoading ? t('ADDING') : t('ADD_TEMPLATE_TYPE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddTemplateType;

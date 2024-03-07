import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from '../../../auth/services/jwtService'
import { useTranslation } from 'react-i18next';




function AddSize({ sze }) {

    const { t, i18n } = useTranslation('sizesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [size, setSize] = useState({
        id: sze ? sze.id : '',
        sizeName: sze ? sze.sizeName : '',
        description: sze ? sze.description: ''
    });

    const handleChange = (prop) => (event) => {
        setSize({ ...size, [prop]: event.target.value });
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


    const handleAddSize = async (event) => {
        event.preventDefault();
        
        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'size',
                data: size
             }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };

    const handleUpdateSize = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true)
            const res = await jwtService.updateItem({ 
                itemType: 'size',
                data: {
                    data: size,
                    itemId: size.id
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={sze ? handleUpdateSize : handleAddSize}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('SIZE_NAME')}
                        variant="outlined"
                        value={size.sizeName}
                        onChange={handleChange('sizeName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={size.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {sze ? (isLoading ? t('UPDATING') : t('UPDATE_SIZE')) : (isLoading ? t('ADDING') : t('ADD_SIZE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddSize;

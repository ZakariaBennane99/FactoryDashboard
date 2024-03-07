import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../../../../app/auth/services/jwtService'
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';




function AddColor({ clr }) {

    const { t, i18n } = useTranslation('colorsPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    const [color, setColor] = useState({
        id: clr ? clr.id : '',
        colorName: clr ? clr.colorName : '',
        colorCode: clr ? clr.colorCode : '',
        description: clr ? clr.description : ''
    });

    const handleChange = (prop) => (event) => {
        setColor({ ...color, [prop]: event.target.value });
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

    const handleUpdateColor = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'color',
                data: {
                    data: color,
                    itemId: color.id
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

    const handleAddColor = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'color',
                data: color
             }, { 'Content-Type': 'application/json' });
            if (res.status === 201) {
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
            <form onSubmit={clr ? handleUpdateColor : handleAddColor}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('COLOR_NAME')}
                        variant="outlined"
                        value={color.colorName}
                        onChange={handleChange('colorName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('COLOR_CODE')}
                        variant="outlined"
                        value={color.colorCode}
                        onChange={handleChange('colorCode')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={color.description}
                        onChange={handleChange('description')}
                        required
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {clr ? (isLoading ? t('UPDATING') : t('UPDATE_COLOR')) : (isLoading ? t('ADDING') : t('ADD_COLOR'))}
                </button>
            </form>
        </Box>
    );
}

export default AddColor;
import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';




function AddTextile({ txtle }) {

    const { t, i18n } = useTranslation('textilesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [textile, setTextile] = useState({
        id: txtle ? txtle.id : '',
        textileName: txtle ? txtle.textileName : '',
        textileType: txtle ? txtle.textileType : '',
        composition: txtle ? txtle.composition : '',
        description: txtle ? txtle.description : ''
    });

    const handleChange = (prop) => (event) => {
        setTextile({ ...textile, [prop]: event.target.value });
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

    const handleAddTextiles = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            // @route: api/create/textiles
            // @description: create a new textile
            const res = await jwtService.createItem({ 
                itemType: 'productcatalogtextile',
                data: textile
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

    const handleUpdateTextiles = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            // @route: api/update/textiles
            // @description: update existing textile
            const res = await jwtService.updateItem({ 
                itemType: 'productcatalogtextile',
                data: {
                    data: textile,
                    itemId: textile.id
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
            <form onSubmit={txtle ? handleUpdateTextiles : handleAddTextiles}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('TEXTILE_NAME')}
                        variant="outlined"
                        value={textile.textileName}
                        onChange={handleChange('textileName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('TEXTILE_TYPE')}
                        variant="outlined"
                        value={textile.textileType}
                        onChange={handleChange('textileType')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('COMPOSITION')}
                        variant="outlined"
                        value={textile.composition}
                        onChange={handleChange('composition')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={textile.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                  {txtle ? (isLoading ? t('UPDATING') : t('UPDATE_TEXTILE')) : (isLoading ? t('ADDING') :t('ADD_TEXTILE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddTextile;

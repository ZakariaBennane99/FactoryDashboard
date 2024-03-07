import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import {  closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';





function AddCategoryI({ ctgrI }) {

    const { t, i18n } = useTranslation('categoriesIPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [categoryI, setCategoriesI] = useState({
        id: ctgrI ? ctgrI.id : '',
        name: ctgrI ? ctgrI.name : '',
        description: ctgrI ? ctgrI.description : '',
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
        setCategoriesI({ ...categoryI, [prop]: event.target.value });
    };

    const handleAddCategoryI = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            // @route: api/create/categoryI
            // @description: create a new categoryI
            const res = await jwtService.createItem({ 
                itemType: 'productcatalogcategoryone',
                data: categoryI
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

    const handleUpdateCategoryI = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'productcatalogcategoryone',
                data: {
                    data: categoryI,
                    itemId: categoryI.id
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
            <form onSubmit={ctgrI ? handleUpdateCategoryI : handleAddCategoryI}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('CATEGORY_I_NAME')}
                        variant="outlined"
                        value={categoryI.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={categoryI.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {ctgrI ? (isLoading ? t('UPDATING') : t('UPDATE_CATEGORY_ONE')) : (isLoading ? t('ADDING') : t('ADD_CATEGORY_ONE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddCategoryI;

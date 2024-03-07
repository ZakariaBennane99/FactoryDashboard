import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';




function AddMaterial({ mtrlCat }) {

    const { t, i18n } = useTranslation('materialCategoriesPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useAppDispatch();

    const [materialCategory, setMaterial] = useState({
        id: mtrlCat ? mtrlCat.id : '',
        name: mtrlCat ? mtrlCat.name : '',
        description: mtrlCat ? mtrlCat.description : '',
    });

    const handleChange = (prop) => (event) => {
        setMaterial({ ...materialCategory, [prop]: event.target.value });
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

    const handleAddMaterialCategories = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            // @route: api/create/materialCategories
            // @description: create a new Material Category
            const res = await jwtService.createItem({ 
                itemType: 'materialcategory',
                data: materialCategory
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

    const handleUpdateMaterialCategories = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'materialcategory',
                data: {
                    data: materialCategory,
                    itemId: materialCategory.id
                }
             }, { 'Content-Type': 'application/json' });
            if (res.status === 200) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            showMsg(_error, 'error')
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mtrlCat ? handleUpdateMaterialCategories : handleAddMaterialCategories}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('MATERIAL_CATEGORY_NAME')}
                        variant="outlined"
                        value={materialCategory.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={materialCategory.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                {mtrlCat ? (isLoading ? t('UPDATING') : t('UPDATE_MATERIAL_CATEGORY_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_MATERIAL_CATEGORY_BUTTON'))}
                </button>

            </form>
        </Box>
    );
}

export default AddMaterial;

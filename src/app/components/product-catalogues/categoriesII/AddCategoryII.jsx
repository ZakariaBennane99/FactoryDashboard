import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';



function AddCategoryII({ ctgrII }) {

    const { t, i18n } = useTranslation('categoriesIIPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);    

    const [categoryII, setCategoriesII] = useState({
        id: ctgrII ? ctgrII.id : '',
        name: ctgrII ? ctgrII.name : '',
        description: ctgrII ? ctgrII.description : '',
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
        setCategoriesII({ ...categoryII, [prop]: event.target.value });
    };

    const handleAddCategoryII = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'productcatalogcategorytwo',
                data: categoryII
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

    const handleUpdateCategoryII = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'productcatalogcategorytwo',
                data: {
                    data: categoryII,
                    itemId: ctgrII.id
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
            <form onSubmit={ctgrII ? handleUpdateCategoryII : handleAddCategoryII}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('CATEGORY_II_NAME')}
                        variant="outlined"
                        value={categoryII.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={categoryII.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {ctgrII ? (isLoading ? t('UPDATING') : t('UPDATE_CATEGORY_TWO')) : (isLoading ? t('ADDING') : t('ADD_CATEGORY_TWO'))}
                </button>
            </form>
        </Box>
    );
}

export default AddCategoryII;

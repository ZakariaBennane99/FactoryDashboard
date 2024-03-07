import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';




function AddProductCatalogue({  prdctCatalogue }) {

    const { t, i18n } = useTranslation('cataloguesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false)

    const [productCatalogue, setProductCatalogue] = useState({
        id: prdctCatalogue ? prdctCatalogue.id : '',
        name: prdctCatalogue ? prdctCatalogue.name : '',
        description: prdctCatalogue ? prdctCatalogue.description : '',
    });

    const handleChange = (prop) => (event) => {
        setProductCatalogue({ ...productCatalogue, [prop]: event.target.value });
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

    const handleAddProductCatalogues = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'productcatalog',
                data: productCatalogue
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

    const handleUpdateProductCatalogues = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'productcatalog',
                data: {
                    data: productCatalogue,
                    itemId: prdctCatalogue.id
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
            <form onSubmit={prdctCatalogue ? handleUpdateProductCatalogues : handleAddProductCatalogues}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('PRODUCT_CATALOGUE_NAME')}
                        variant="outlined"
                        value={productCatalogue.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={productCatalogue.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                {prdctCatalogue ? (isLoading ? t('UPDATING') : t('UPDATE_PRODUCT_CATALOGUE_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_PRODUCT_CATALOGUE_BUTTON'))}
                </button>
            </form>
        </Box>
    );
}

export default AddProductCatalogue;

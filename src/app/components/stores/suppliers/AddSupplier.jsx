import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';




function AddSupplier({ splier }) {

    const { t, i18n } = useTranslation('suppliersPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [supplier, setSupplier] = useState({
        id: splier ? splier.id : '',
        name: splier ? splier.name : '',
        phone: splier ? splier.phone : '',
        email: splier ? splier.email : '',
        address: splier ? splier.address : ''
    });

    const handleChange = (prop) => (event) => {
        setSupplier({ ...supplier, [prop]: event.target.value });
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

    const handleAddSuppliers = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            // @route: api/create/suppliers
            // @description: create a new supplier
            const res = await jwtService.createItem({ 
                itemType: 'supplier',
                data: supplier
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

    const handleUpdateSuppliers = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'supplier',
                data: {
                    data: supplier,
                    itemId: supplier.id
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
            <form onSubmit={splier ? handleUpdateSuppliers : handleAddSuppliers}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('SUPPLIER_NAME_LABEL')}
                        variant="outlined"
                        value={supplier.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('PHONE_LABEL')}
                        variant="outlined"
                        value={supplier.phone}
                        onChange={handleChange('phone')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('EMAIL_LABEL')}
                        variant="outlined"
                        value={supplier.email}
                        onChange={handleChange('email')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('ADDRESS_LABEL')}
                        variant="outlined"
                        value={supplier.address}
                        onChange={handleChange('address')}
                        required
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {splier ? (isLoading ? t('UPDATING') : t('UPDATE_SUPPLIER_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_SUPPLIER_BUTTON')) }
                </button>
            </form>
        </Box>
    );
}

export default AddSupplier;

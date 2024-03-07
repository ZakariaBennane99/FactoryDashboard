import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';





function AddMaterial({ mtrl }) {

    const { t, i18n } = useTranslation('materialsPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false)

    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState([])

    const [material, setMaterial] = useState({
        id: mtrl ? mtrl.id : '',
        name: mtrl ? mtrl.name : '',
        type: mtrl ? mtrl.type : '',
        color: mtrl ? mtrl.color : '',
        quantity: mtrl ? mtrl.quantity : '',
        unitOfMeasure: mtrl ? mtrl.unitOfMeasure : '',
        category: mtrl ? mtrl.category : '',
        supplier: mtrl ? mtrl.supplier : '',
        description: mtrl ? mtrl.description : '',
    });

    const handleChange = (prop) => (event) => {
        if (prop === 'supplier') { 
            const selectedSupplier = suppliers.find(supplier => supplier.id === event.target.value);
            setMaterial({ ...material, [prop]: selectedSupplier });
        } else if (prop === 'category') {
            const selectedCategory = categories.find(category => category.id === event.target.value);
            setMaterial({ ...material, [prop]: selectedCategory });
        } else {
            setMaterial({ ...material, [prop]: event.target.value });
        }
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

    const handleAddMaterials = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            // @route: api/create/materials
            // @description: create a new material
            const res = await jwtService.createItem({ 
                itemType: 'material',
                data: material
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

    const handleUpdateMaterials = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'material',
                data: {
                    data: material,
                    itemId: material.id
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

    useEffect(() => {    
        async function getSuppliersNames() {
            try {
                const res = await jwtService.getItemNames(['supplier', 'materialcategory']);
                if (res) {
                    setSuppliers(res[0].data)
                    setCategories(res[1].data)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getSuppliersNames();
    }, []);


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mtrl ? handleUpdateMaterials : handleAddMaterials}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('MATERIAL_NAME')}
                        variant="outlined"
                        value={material.name}
                        onChange={handleChange('name')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('MATERIAL_TYPE')}
                        variant="outlined"
                        value={material.type}
                        onChange={handleChange('type')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('COLOR')}
                        variant="outlined"
                        value={material.color}
                        onChange={handleChange('color')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('QUANTITY')}
                        variant="outlined"
                        type='number'
                        value={material.quantity}
                        onChange={handleChange('quantity')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('UNIT_OF_MEASURE')}
                        variant="outlined"
                        value={material.unitOfMeasure}
                        onChange={handleChange('unitOfMeasure')}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="supplier-select-label">{t('SUPPLIER')}</InputLabel>
                    <Select
                        labelId="supplier-select-label"
                        id="supplier-select"
                        value={material.supplier ? material.supplier.id : ''}
                        label={t('SUPPLIER')}
                        onChange={handleChange('supplier')}
                        required
                    >{ 
                        suppliers.map(supplier => (
                          <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                          </MenuItem>
                        ))  
                    }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-select-label">{t('CATEGORY')}</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={material.category ? material.category.id : ''}
                        label={t('CATEGORY')}
                        onChange={handleChange('category')}
                        required
                    >{ 
                        categories.map(category => (
                          <MenuItem key={category.id} value={category.id}>
                              {category.name}
                          </MenuItem>
                        ))  
                    }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={material.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {mtrl ? (isLoading ? t('UPDATING') : t('UPDATE_MATERIAL')) : (isLoading ? t('ADDING') : t('ADD_MATERIAL')) }
                </button>
            </form>
        </Box>
    );
}

export default AddMaterial;

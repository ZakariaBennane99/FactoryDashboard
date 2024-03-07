import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';





function AddTemplate({ tmplt }) {

    const { t, i18n } = useTranslation('templatesPage');
    const lang = i18n.language;


    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [template, setTemplate] = useState({
        id: tmplt ? tmplt.id : '',
        productCatalogueDetail: tmplt ? tmplt.productCatalogueDetail : '',
        templateName: tmplt ? tmplt.templateName : '',
        description: tmplt ? tmplt.description : '',
        file: null
    });

    const [productCatalogueDetails, setProductCatalogueDetails] = useState([])

    const handleChange = (prop) => (event) => {
        if (prop === 'productCatalogueDetail') {
            const tmple = productCatalogueDetails.find(supplier => supplier.id === event.target.value);
            setTemplate({ ...template, [prop]: tmple });
        } else {
            setTemplate({ ...template, [prop]: event.target.value });
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

    const handleAddTemplates = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        const formData = new FormData();
        // Append the file to formData if it exists
        if (template.file) {
            formData.append('template', template.file);
        }

    
        // Append other user fields to formData
        formData.append('name', template.templateName);
        formData.append('description', template.description);
        formData.append('productCatalogDetailId', template.productCatalogueDetail.id);

        try {
            const res = await jwtService.createItem({ 
                itemType: 'template',
                data: formData
             }, { 'Content-Type': 'multipart/form-data' });
            if (res.status === 201) {
                showMsg(res.message, 'success')
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    };

    const handleUpdateTemplates = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {

            const formData2 = new FormData();
            // Append the file to formData if it exists
            if (template.file) {
                formData2.append('template', template.file);
            }
    
    
            // Append other user fields to formData
            formData2.append('name', template.templateName);
            formData2.append('description', template.description);
            formData2.append('productCatalogDetailId', template.productCatalogueDetail.id);


            for (let [key, value] of formData2.entries()) {
                console.log(key, value);
            }
            const res = await jwtService.updateItem({ 
                itemType: 'template',
                data: {
                    itemId: template.id,
                    data: formData2
                }
             }, { 'Content-Type': 'multipart/form-data' });
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

    useEffect(() => {    
        async function getDetailsData() {
            try {
                // here it will show the productCatalogName related 
                // to the shown prod
                const res = await jwtService.getItemNames(['productcatalogtdetail']);
                if (res) {
                    setProductCatalogueDetails(res[0].data)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getDetailsData();
    }, []);


    

    function handleFileChange(e) {
        const fl = e.target.files[0];
        setTemplate({...template, file: fl});
    }

    
    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={tmplt ? handleUpdateTemplates : handleAddTemplates}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-detail-select-label">{t('PRODUCT_CATALOGUE_DETAIL')}</InputLabel>
                    <Select
                        labelId="product-catalogue-detail-select-label"
                        id="product-catalogue-detail-select"
                        value={template.productCatalogueDetail ? template.productCatalogueDetail.id : ''}
                        label={t('PRODUCT_CATALOGUE_DETAIL')}
                        onChange={handleChange('productCatalogueDetail')}
                        required
                    >
                        { 
                            productCatalogueDetails.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('TEMPLATE_NAME')}
                        variant="outlined"
                        value={template.templateName}
                        onChange={handleChange('templateName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={template.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('FILE')}
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={handleFileChange}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {tmplt ? (isLoading ? t('UPDATING') : t("UPDATE_TEMPLATE")) : (isLoading ? t('ADDING') : t('ADD_TEMPLATE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddTemplate;

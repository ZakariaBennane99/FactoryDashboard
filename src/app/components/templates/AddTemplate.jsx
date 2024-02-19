import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function AddTemplate({ tmplt }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [template, setTemplate] = useState({
        productCatalogueDetail: tmplt ? tmplt.description : '',
        templateName: tmplt ? tmplt.description : '',
        description: tmplt ? tmplt.description : '',
        fileName: tmplt ? tmplt.description : ''
    });

    const [productCatalogueDetails, setProductCatalogueDetails] = useState([
        'Cotton Fabric',
        'Wool Fabric',
        'Polyester Fabric'
    ])

    const handleChange = (prop) => (event) => {
        setTemplate({ ...template, [prop]: event.target.value });
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
        
        try {
            // @route: api/create/templates
            // @description: create a new template
            const res = await jwtService.createItem({ 
                itemTemplate: 'templates',
                data: {
                    data: templateTemplate,
                    currentUserId: currentUserId
                }
             }, { 'Content-Template': 'application/json' });
            if (res) {
                showMsg(res, 'success')
            }
        } catch (_error) {
            showMsg(_error, 'error')
        } 
    };

    const handleUpdateTemplates = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/templates
            // @description: update an existing template
            const res = await jwtService.updateItem({ 
                itemTemplate: 'templates',
                data: {
                    data: templateTemplate,
                    currentUserId: currentUserId,
                    itemId: tmplt.templateId
                }
             }, { 'Content-Template': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };

    /* TO BE UNCOMMENTED IN PRODUCTION
    // get the names of existing product catalogue details
    useEffect(() => {    
        async function getProductCatalogueDetails() {
            try {
                // @route: api/productCatalogueDetails
                // @description: get Manager Names 
                // @response: an array of existing product catalogue details
                const res = await jwtService.getProductCatalogueDetails({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setProductCatalogueDetails(res)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getProductCatalogueDetails();
    }, []);*/


    
    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={tmplt ? handleUpdateTemplates : handleAddTemplates}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-detail-select-label">Product Catalogue Detail</InputLabel>
                    <Select
                        labelId="product-catalogue-detail-select-label"
                        id="product-catalogue-detail-select"
                        value={template.productCatalogueDetail}
                        label="Product Catalogue Detail"
                        onChange={handleChange('productCatalogueDetail')}
                        required
                    >
                        {productCatalogueDetails.map((detail, index) => (
                            <MenuItem key={index} value={detail}>
                                {detail}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Name"
                        variant="outlined"
                        value={template.templateName}
                        onChange={handleChange('TemplateName')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={template.description}
                        onChange={handleChange('Description')}
                        multiline
                        rows={3}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{tmplt ? 'Update' : 'Add'} Template</button>
            </form>
        </Box>
    );
}

export default AddTemplate;

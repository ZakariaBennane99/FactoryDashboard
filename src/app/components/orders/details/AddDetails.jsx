import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddOrderDetails({ dtls }) {

    const currentUserId = window.localStorage.getItem('userId')

    const [order, setOrder] = useState({
        orderNumber: dtls ? dtls.orderNumber : '',
        quantityDetails: dtls ? dtls.quantityDetails : '',
        templatePattern: dtls ? dtls.templatePattern : '',
        productCatalogue: dtls ? dtls.productCatalogue : '',
        modelName: dtls ? dtls.modelName : '',
        modelQuantity: dtls ? dtls.modelQuantity : 0
    });

    const [orderData, setOrderData] = useState({
        templatePatterns: ['Basic Tee', 'Classic Jeans', 'Summer Dress'],
        productCatalogues: ['Summer Collection 2024', 'Autumn Collection 2024', 'Winter Collection 2024'],
        modelNames: ['Sunshine Tee', 'Rugged Denim', 'Breezy Sundress', 'Classic White Shirt', 'Winter Puffer', 'Stretch Yoga Pants', 'Cozy Knit']
    })

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
        setOrder({ ...order, [prop]: event.target.value });
    };

    const handleAddDetails = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/orderDetails
            // @description: create a new orderDetails
            const res = await jwtService.createItem({ 
                itemType: 'orderDetails',
                data: {
                    data: order,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };

    const handleUpdateDetails = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/orderDetails
            // @description: update order details
            const res = await jwtService.updateItem({ 
                itemType: 'orderDetails',
                data: {
                    data: order,
                    currentUserId: currentUserId,
                    itemId: dtls.orderId
                }
             }, { 'Content-Type': 'application/json' });
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
    // get order data: templatePatterns, productCatalogues, modelNames
    useEffect(() => {    
        async function getOrderData() {
            try {
                // @route: api/orderData
                // @description: get order Data <templatePatterns, productCatalogues, modelNames>
                const res = await jwtService.getOrderData({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setOrderData({
                        templatePatterns: res.templatePatterns,
                        productCatalogues: res.productCatalogues,
                        modelNames: res.modelNames
                    })
                }
            } catch (_error) {
                // the error msg will be sent so you don't have to hardcode it
                showMsg(_error, 'error')
            }
        }
        
        getOrderData();
    }, []);*/


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dtls ? handleUpdateDetails : handleAddDetails}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Order Number"
                        variant="outlined"
                        type="number"
                        value={order.orderNumber}
                        onChange={handleChange('orderNumber')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Quantity Details"
                        variant="outlined"
                        value={order.quantityDetails}
                        onChange={handleChange('quantityDetails')}
                        multiline
                        rows={2}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-pattern-select-label">Template Pattern</InputLabel>
                    <Select
                        labelId="template-pattern-select-label"
                        id="template-pattern-select"
                        value={order.templatePattern}
                        label="Template Pattern"
                        onChange={handleChange('templatePattern')}
                        required
                    >
                        {orderData.templatePatterns.map((pattern, index) => (
                            <MenuItem key={index} value={pattern}>{pattern}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-select-label">Product Catalogue</InputLabel>
                    <Select
                        labelId="product-catalogue-select-label"
                        id="product-catalogue-select"
                        value={order.productCatalogue}
                        label="Product Catalogue"
                        onChange={handleChange('productCatalogue')}
                        required
                    >
                        {orderData.productCatalogues.map((catalogue, index) => (
                            <MenuItem key={index} value={catalogue}>{catalogue}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="model-name-select-label">Model Name</InputLabel>
                    <Select
                        labelId="model-name-select-label"
                        id="model-name-select"
                        value={order.modelName}
                        label="Model Name"
                        onChange={handleChange('modelName')}
                        required
                    >
                        {orderData.modelNames.map((name, index) => (
                            <MenuItem key={index} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label="Model Quantity"
                        variant="outlined"
                        type="number"
                        value={order.modelQuantity}
                        onChange={handleChange('modelQuantity')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                <button type="submit" className="add-internalOrder-btn">{dtls ? 'Update' : 'Add'} Order Details</button>
            </form>
        </Box>
    );
}

export default AddOrderDetails;

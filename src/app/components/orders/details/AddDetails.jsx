import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';





function AddOrderDetails({ dtls }) {

    const { t, i18n } = useTranslation('orderDetailsPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [order, setOrder] = useState({
        id: dtls ? dtls.id : '',
        orderNumber: dtls ? dtls.orderNumber : '', // it has the orderId
        quantityDetails: dtls ? dtls.quantityDetails : '',
        productCatalogue: dtls ? dtls.productCatalogue : '', // ProductCatalogDetails id and the productCatalogName
        modelQuantity: dtls ? dtls.modelQuantity : 0
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

    const [orders, setOrders] = useState([])
    const [productcatalogtdetails, setProduCatalogDetails] = useState([])
    
    const handleChange = (prop) => (event) => {
        if (prop === 'orderNumber') {
            // Find the selected order from the orders state array
            const selectedOrder = orders.find(ord => ord.id === event.target.value);
            // Update the order state with the selected order's details
            setOrder({ ...order, [prop]: { id: selectedOrder.id, name: selectedOrder.name } });
        } else if (prop === 'productCatalogue') {
            // Find the selected product catalogue from the productcatalogtdetails state array
            const selectedCatalogue = productcatalogtdetails.find(cat => cat.id === event.target.value);
            // Update the order state with the selected product catalogue's details
            setOrder({ ...order, [prop]: { id: selectedCatalogue.id, name: selectedCatalogue.name } });
        } else {
            // For all other properties, update directly with the event's target value
            setOrder({ ...order, [prop]: event.target.value });
        }
    };

    const handleAddDetails = async (event) => {
        event.preventDefault();
        
        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'orderdetail',
                data: order
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

    const handleUpdateDetails = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'orderdetail',
                data: {
                    data: order,
                    itemId: order.id
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
        async function getDt() {
            try {
                const res = await jwtService.getItemNames(['order', 'productcatalogtdetail']);
                if (res) {
                    console.log(res)
                    setOrders(res[0].data)
                    setProduCatalogDetails(res[1].data)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getDt();
    }, []);



    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dtls ? handleUpdateDetails : handleAddDetails}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="order-number-select-label">{t('ORDER_NUMBER')}</InputLabel>
                    <Select
                        labelId="order-number-select-label"
                        id="order-number-select"
                        value={order.orderNumber ? order.orderNumber.id : ''}
                        label={t('ORDER_NUMBER')}
                        onChange={handleChange('orderNumber')}
                        required
                    >
                        {orders.map(ord => (
                            <MenuItem key={ord.id} value={ord.id}>{ord.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-select-label">{t('PRODUCT_CATALOGUE')}</InputLabel>
                    <Select
                        labelId="product-catalogue-select-label"
                        id="product-catalogue-select"
                        value={order.productCatalogue ? order.productCatalogue.id : "" }
                        label={t('PRODUCT_CATALOGUE')}
                        onChange={handleChange('productCatalogue')}
                        required
                    >
                        {productcatalogtdetails.map(prdc => (
                            <MenuItem key={prdc.id} value={prdc.id}>
                                {prdc.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('MODEL_QUANTITY')}
                        variant="outlined"
                        type="number"
                        value={order.modelQuantity}
                        onChange={handleChange('modelQuantity')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                
                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('QUANTITY_DETAILS')}
                        variant="outlined"
                        value={order.quantityDetails}
                        onChange={handleChange('quantityDetails')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>


                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {dtls ? (isLoading ? t('UPDATING') : t('UPDATE')) : (isLoading ? t('ADDING') : t('ADD'))}
                </button>
            </form>
        </Box>
    );
}

export default AddOrderDetails;

import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, InputLabel, Select, MenuItem,  } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../../../app/auth/services/jwtService';
import { useTranslation } from 'react-i18next';






function AddModel({ mdl }) {

    const { t, i18n } = useTranslation('modelsPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    const [model, setModel] = useState({
        id: mdl ? mdl.id : '',
        modelName: mdl ? mdl.modelName : "",
        order: mdl ? mdl.order : '',
        template: mdl ? mdl.template : '',
        orderDetails: mdl ? mdl.orderDetails : '',
        modelImage: mdl ? mdl.modelImage : '',
        color: mdl ? mdl.color : '',
        size: mdl ? mdl.size : '',
        quantity: mdl ? mdl.quantity : '',
        quantityDetails: mdl ? mdl.quantityDetails : '',
        notes: mdl ? mdl.notes : ''
    });

    function showMsg(msg, status) {
        // take the itemId, and delete the item
    
        // then close the dialog, and show a quick message
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

    const handleAddModel = async (event) => {
        event.preventDefault();

        setIsLoading(true)

        // Create a FormData object
        const formData = new FormData();
        // Append the file to formData if it exists
        if (model.modelImage) {
            formData.append('model', model.modelImage);
        }
    
        formData.append('modelName', model.modelName);
        formData.append('order', JSON.stringify(model.order));
        formData.append('template', JSON.stringify(model.template));
        formData.append('orderDetails', JSON.stringify(model.orderDetails));
        formData.append('color', JSON.stringify(model.color));
        formData.append('size', JSON.stringify(model.size));
        formData.append('quantity', model.quantity);
        formData.append('quantityDetails', model.quantityDetails);
        formData.append('notes', model.notes);

        try {
            const res = await jwtService.createItem({ 
                itemType: 'model',
                data: formData
             }, { 'Content-Type': 'multipart/form-data' });
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

    const handleUpdateModel = async (event) => {
        event.preventDefault();

        setIsLoading(true)

        // Create a FormData object
        const formData = new FormData();
        // Append the file to formData if it exists
        if (model.modelImage) {
            formData.append('model', model.modelImage);
        }
    
        formData.append('modelName', model.modelName);
        formData.append('order', model.order);
        formData.append('template', model.template);
        formData.append('orderDetails', model.orderDetails);
        formData.append('color', model.color);
        formData.append('size', model.size);
        formData.append('quantity', model.quantity);
        formData.append('quantityDetails', model.quantityDetails);
        formData.append('notes', model.notes);

        try {
            // @route: api/update/model
            // @description: update an existing model
            const res = await jwtService.updateItem({ 
                itemType: 'model',
                data: {
                    data: formData,
                    itemId: model.id
                }
             }, { 'Content-Type': 'multipart/form-data' });
            if (res.status === 200) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res.message, 'success')
            }
        } catch (_errors) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_errors.message, 'error')
        } finally {
            setIsLoading(false)
        }
        
    };


    // here you should filter the each array based on the 
    // previous chosen element from the previous 
    // array
    const [orderDetails, setOrderDetails] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [templates, setTemplates] = useState([]);


    useEffect(() => {    
        async function getSeasons() {
            try {
                const res = await jwtService.getItemNames(['orderdetail', 'color', 'size', 'order', 'template']);
                if (res) {
                    setOrderDetails(res[0].data);
                    setColors(res[1].data);
                    setSizes(res[2].data);
                    setOrders(res[3].data);
                    setTemplates(res[4].data);
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getSeasons();
    }, []);

    const handleChange = (prop) => (event) => {
        const value = event.target.value;
    
        if (prop === 'orderDetails') {
            // Find the selected orderDetail from the orderDetails state
            const selectedOrderDetail = orderDetails.find(detail => detail.id === value);
            setModel({ ...model, orderDetails: selectedOrderDetail });
        } else if (prop === 'color') {
            // Find the selected color from the colors state
            const selectedColor = colors.find(color => color.id === value);
            setModel({ ...model, color: selectedColor });
        } else if (prop === 'size') {
            // Find the selected size from the sizes state
            const selectedSize = sizes.find(size => size.id === value);
            setModel({ ...model, size: selectedSize });
        } else if (prop === 'order') {
            // Find the selected order from the orders state
            const selectedOrder = orders.find(order => order.id === value);
            setModel({ ...model, order: selectedOrder });
        } else if (prop === 'template') {
            // Find the selected template from the templates state
            const selectedTemplate = templates.find(template => template.id === value);
            setModel({ ...model, template: selectedTemplate });
        } else {
            // For all other properties, just update the value directly
            setModel({ ...model, [prop]: value });
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setModel({...model, modelImage: file});
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={mdl ? handleUpdateModel : handleAddModel}>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('MODEL_NAME')}
                            variant="outlined"
                            type="string"
                            value={model.modelName}
                            onChange={handleChange('modelName')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="model-name-select-label">{t('ORDER_NUMBER')}</InputLabel>
                        <Select
                            labelId="model-name-select-label"
                            id="model-name-select"
                            value={model.order ? model.order.id : ''}
                            label={t('ORDER_NUMBER')}
                            onChange={handleChange('order')}
                            required
                        >
                            {orders.map((order) => (
                                <MenuItem key={order.id} value={order.id}>{order.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="order-detail-select-label">{t('ORDER_DETAIL')}</InputLabel>
                        <Select
                            labelId="order-detail-select-label"
                            id="order-detail-select"
                            value={model.orderDetails ? model.orderDetails.id : ''}
                            label={t('ORDER_DETAIL')}
                            onChange={handleChange('orderDetails')}
                            required
                            disabled={!model.order}
                        >
                            {orderDetails.map((detail) => (
                                <MenuItem key={detail.id} value={detail.id}>{detail.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="template-select-label">{t('TEMPLATE')}</InputLabel>
                        <Select
                            labelId="template-select-label"
                            id="template-select"
                            value={model.template ? model.template.id : ''}
                            label={t('TEMPLATE')}
                            onChange={handleChange('template')}
                            required
                            disabled={!model.orderDetails}
                        >
                            {templates.map((template) => (
                                <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="size-select-label">{t('SIZE')}</InputLabel>
                        <Select
                            labelId="size-select-label"
                            id="size-select"
                            value={model.size ? model.size.id : ""}
                            label={t('SIZE')}
                            onChange={handleChange('size')}
                            required
                            disabled={!model.template}
                        >
                            {sizes.map(size => (
                                <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="color-select-label">{t('COLOR')}</InputLabel>
                        <Select
                            labelId="color-select-label"
                            id="color-select"
                            value={model.color ? model.color.id : ''}
                            label={t('COLOR')}
                            onChange={handleChange('color')}
                            required
                        >
                            {colors.map(color => (
                                <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('QUANTITY')}
                            variant="outlined"
                            type="number"
                            value={model.quantity}
                            onChange={handleChange('quantity')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('QUANTITY_DETAILS')}
                            variant="outlined"
                            type="string"
                            value={model.quantityDetails}
                            onChange={handleChange('quantityDetails')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('MODEL_IMAGE')}
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={handleFileChange}
                    />
                </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label={t('NOTES')}
                            variant="outlined"
                            type="string"
                            value={model.notes}
                            onChange={handleChange('notes')}
                            multiline
                            rows={3}
                        />
                    </FormControl>

                    <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                        {mdl ? (isLoading ? t('UPDATING') : t('UPDATE_MODEL_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_MODEL_BUTTON'))}
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddModel;

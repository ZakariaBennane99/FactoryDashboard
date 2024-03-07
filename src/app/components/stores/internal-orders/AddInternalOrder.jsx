import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';




function AddInternalOrder({ intrlOrder }) {

    const { t, i18n } = useTranslation('internalOrdersPage');
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    const [internalOrder, setInternalOrder] = useState({
        id: intrlOrder ? intrlOrder.id : '',
        department: intrlOrder ? intrlOrder.department : '', // obj: Id, Name DISABLED
        expectedDelivery: intrlOrder ? new Date(intrlOrder.expectedDelivery) : null,
        priority: intrlOrder ? intrlOrder.priority : '',
        orderDate: intrlOrder ? intrlOrder.OrderDate : '', // disabled
        status: intrlOrder ? intrlOrder.status : (lang === 'ar' ? 'قيد الانتظار' :'PENDING'),
        material: intrlOrder ? intrlOrder.material : '', // obj: Id, Name
        quantity: intrlOrder ? intrlOrder.quantity : 0,
        specifics: intrlOrder ? intrlOrder.specifics : '',
        notes: intrlOrder ? intrlOrder.notes : ''
    });

    
    const [materials, setMaterials] = useState([]);
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    const statuses = [
        'PENDING', 'APPROVED', 'REJECTED', 'FULFILLED',
        'CANCELLED', 'COMPLETED', 'ONGOING'
    ];
    const prioritiesAr = ['عالي', 'متوسط', 'منخفض'];
    const statusesAr = [
        'قيد الانتظار', 'موافق عليه', 'مرفوض', 'تم التنفيذ',
        'ملغي', 'مكتمل', 'جاري'
    ];

    
    const handleChange = (prop) => (event) => {
        if (prop === 'material') {
            const selectedItem = materials.find(item => item.id === event.target.value);
            setInternalOrder({ ...internalOrder, [prop]: selectedItem });
        } else {
            setInternalOrder({ ...internalOrder, [prop]: event.target.value });
        }
    };

    const handleDateChange = (date) => {
        setInternalOrder({ ...internalOrder, expectedDelivery: date });
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

    const handleAddInternalOrders = async (event) => {
        event.preventDefault();

        if (lang === 'ar') {
            setInternalOrder({ ...internalOrder,
                priority: priorities[prioritiesAr.indexOf(internalOrder.priority)],
                status: statuses[statusesAr.indexOf(internalOrder.status)]
            })
        }
        
        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'internalorder',
                data: internalOrder
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

    const handleUpdateInternalOrders = async (event) => {
        event.preventDefault();

        if (lang === 'ar') {
            setInternalOrder({ ...internalOrder,
                priority: priorities[prioritiesAr.indexOf(internalOrder.priority)],
                status: statuses[statusesAr.indexOf(internalOrder.status)]
            })
        }
        try {
            setIsLoading(true)
            const res = await jwtService.updateItem({ 
                itemType: 'internalorder',
                data: {
                    data: internalOrder,
                    itemId: internalOrder.id
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




    useEffect(() => {    
        async function getSeasons() {
            try {
                const res = await jwtService.getItemNames(['material']);
                if (res) {
                    setMaterials(res[0].data);
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getSeasons();
    }, []);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={intrlOrder ? handleUpdateInternalOrders : handleAddInternalOrders}>
                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Expected Delivery"
                            value={internalOrder.expectedDelivery}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required/>}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="department-select-label">{t('DEPARTMENT')}</InputLabel>
                        <Select
                            labelId="department-select-label"
                            id="department-select"
                            value={internalOrder.department ? internalOrder.department.Name : ''}
                            label={t('DEPARTMENT')}
                            onChange={handleChange('department')}
                            required
                            disabled
                        >
                                <MenuItem value={internalOrder.department.Name}>
                                    {lang === 'ar' ? 'الهندسة' : 'Engineering' }
                                </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-select-label">{t('PRIORITY')}</InputLabel>
                        <Select
                            labelId="priority-select-label"
                            id="priority-select"
                            value={internalOrder.priority}
                            label={t('PRIORITY')}
                            onChange={handleChange('priority')}
                            required
                        >
                            {
                                lang === 'ar' ?
                            prioritiesAr.map((priority, index) => (
                                <MenuItem key={index} value={priority}>
                                    {priority}
                                </MenuItem>
                            )) :
                            priorities.map((priority, index) => (
                                <MenuItem key={index} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-select-label">{t('STATUS')}</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={internalOrder.status}
                            label={t('STATUS')}
                            onChange={handleChange('status')}
                            required
                        >
                            {
                                lang === 'ar' ?
                            statusesAr.map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            )) :
                            statuses.map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="material-select-label">{t('MATERIAL')}</InputLabel>
                        <Select
                            labelId="material-select-label"
                            id="material-select"
                            value={internalOrder.material ? internalOrder.material.id : ''}
                            label={t('MATERIAL')}
                            onChange={handleChange('material')}
                            required
                        >
                            {materials.map((material) => (
                                <MenuItem key={material.id} value={material.id}>
                                    {material.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('QUANTITY')}
                            variant="outlined"
                            type="number"
                            value={internalOrder.quantity}
                            onChange={handleChange('quantity')}
                            required
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('SPECIFICS')}
                            variant="outlined"
                            value={internalOrder.specifics}
                            onChange={handleChange('specifics')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            disabled = {true}
                            label={t('ORDER_DATE')}
                            value={internalOrder.orderDate || new Date()}
                            onChange={() => {}}
                            renderInput={(params) => <TextField {...params} disabled />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label={t('NOTES')}
                            variant="outlined"
                            value={internalOrder.notes}
                            onChange={handleChange('notes')}
                            multiline
                            rows={3}
                            required
                        />
                    </FormControl>

                    <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                        {intrlOrder ? (isLoading ? t('UPDATING') : t('UPDATE_INTERNAL_ORDER')) : (isLoading ? t('ADDING') : t('ADD_INTERNAL_ORDER_BUTTON'))}
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddInternalOrder;

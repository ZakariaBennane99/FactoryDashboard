import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';
import { closeDialog } from 'app/store/fuse/dialogSlice';





function AddOrder({ ordr }) {

    const { t, i18n } = useTranslation('ordersPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [order, setOrder] = useState({
        id: ordr ? ordr.id : '',
        orderNumber: ordr ? ordr.orderNumber : '',
        orderDate: ordr ? new Date(ordr.orderDate) : null,
        totalAmount: ordr ? ordr.totalAmount : 0,
        status: ordr ? ordr.status : (lang === 'ar' ? "في الانتظار" : "AWAITING"),
        season: ordr ? ordr.season : ''
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

    const status = ["AWAITING", "TODO", "INPROGRESS", "DONE"];
    const statusAr = ["في الانتظار", "للعمل", "جاري التنفيذ", "مكتمل"];

    const [seasons, setSeasons] =  useState([])

    const handleChange = (prop) => (event) => {
        if (prop === 'season') {
            const tmple = seasons.find(supplier => supplier.id === event.target.value);
            setOrder({ ...order, [prop]: tmple });
        } else {
            setOrder({ ...order, [prop]: event.target.value });
        }
    };

    const handleDateChange = (date) => {
        setOrder({ ...order, orderDate: date });
    };


    const handleAddOrder = async (event) => {
        event.preventDefault();
        
        if (lang === 'ar') {
            setOrder({ ...order, 
                status: status[statusAr.indexOf(order.status)] });
        }
        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'order',
                data: order
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

    const handleUpdateOrder = async (event) => {
        event.preventDefault();

        if (lang === 'ar') {
            setOrder({ ...order, 
                status: status[statusAr.indexOf(order.status)] });
        }

        try {
            setIsLoading(true)
            const res = await jwtService.updateItem({ 
                itemType: 'order',
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
        async function getSeasons() {
            try {
                const res = await jwtService.getItemNames(['season']);
                if (res) {
                    setSeasons(res[0].data)
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
                <form onSubmit={ordr ? handleUpdateOrder : handleAddOrder}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('ORDER_NUMBER')}
                            variant="outlined"
                            type="number"
                            value={order.orderNumber}
                            onChange={handleChange('orderNumber')}
                            required
                            disabled={ordr}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label={t('ORDER_DATE')}
                            value={order.orderDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('TOTAL_AMOUNT')}
                            variant="outlined"
                            type="number"
                            value={order.totalAmount}
                            onChange={handleChange('totalAmount')}
                            required
                            inputProps={{ min: 0 }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            select
                            label={t('STATUS')}
                            variant="outlined"
                            value={order.status ? order.status : ''}
                            onChange={handleChange('status')}
                            required
                        >
                            { 
                            lang === 'ar' ? 
                            statusAr.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                            :
                            status.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                            }
                        </TextField>
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            select
                            label={t('SEASON')}
                            variant="outlined"
                            value={order.season ? order.season.id : ''}
                            onChange={handleChange('season')}
                            required
                        >
                            {seasons.map((season) => (
                                <MenuItem key={season.id} value={season.id}>
                                    {season.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                        {ordr ? (isLoading ? t('UPDATING') : t("UPDATE_ORDER")) : (isLoading ? t("ADDING") : t('ADD_ORDER'))}
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddOrder;

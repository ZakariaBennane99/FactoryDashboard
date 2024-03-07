import { useState } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../../../../app/auth/services/jwtService'

function EditModel({ id, depart }) {

    const userRole = window.localStorage.getItem('userRole');

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    // Adjusted state to include new fields
    const [formData, setFormData] = useState({
        receivedFrom: depart,
        damagedItem: '',
        replacedItem: '',
        quantityDelivered: '',
        clothWidthHeight: userRole === 'CUTTING' ? '' : undefined,
        qtyInKg: userRole === 'CUTTING' ? '' : undefined,
        qtyInNumber: userRole === 'CUTTING' ? '' : undefined,
    });

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    function showMsg(msg, status) {
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg,
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical  : 'top',
                    horizontal: 'center'
                },
                variant: status
        })), 100);
    }

    const handleEditModel = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'trackingmodels', 
                data: {
                    data: formData,
                    itemId: id
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
            <form onSubmit={handleEditModel}>
                {Object.keys(formData).map((key) => 
                    formData[key] !== undefined && formData[key] === '' && (
                        <FormControl fullWidth margin="normal" key={key}>
                            <TextField
                                label={key}
                                variant="outlined"
                                value={formData[key]}
                                onChange={handleChange(key)}
                                required
                            />
                        </FormControl>
                    )
                )}
                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Model'}
                </button>
            </form>
        </Box>
    );
}

export default EditModel;
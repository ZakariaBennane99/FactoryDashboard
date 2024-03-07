import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';




function AddMaterialMovement({ mtrlMovement }) {

    const { t, i18n } = useTranslation('materialMovementsPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [materialNames, setMaterialNames] = useState([])
    const [internalOrders, setInternalOrders] = useState([])
    const [fromTo, setFromTo] = useState([])

    const [materialMovement, setMaterialMovement] = useState({
        id: mtrlMovement ? mtrlMovement.id : '',
        materialName: mtrlMovement ? mtrlMovement.materialName : '',
        internalOrder: mtrlMovement ? mtrlMovement.internalOrder : '' ,
        from: mtrlMovement ? mtrlMovement.from : '',
        to: mtrlMovement ? mtrlMovement.to : '',
        movementType: mtrlMovement ? mtrlMovement.movementType : '',
        quantity: mtrlMovement ? mtrlMovement.quantity : 0,
        unitOfMeasure: mtrlMovement ? mtrlMovement.unitOfMeasure : '',
        status: mtrlMovement ? mtrlMovement.status : (lang === 'ar' ? 'قيد الانتظار' : 'PENDING'), // default
        notes: mtrlMovement ? mtrlMovement.notes : ''
    });

    const movementTypes = ['INCOMING', 'OUTGOING', 'TRANSFER', 'RETURN'];
    const statuses = ['REJECTED', 'APPROVED', 'PENDING', 'FULFILLED', 'CANCELLED', 'COMPLETED', 'ONGOING'];

    const movementTypesAr = ['وارد', 'صادر', 'نقل', 'إرجاع'];
    const statusesAr = ['مرفوض', 'موافق', 'قيد الانتظار', 'مكتمل', 'ملغي', 'منتهي', 'جاري'];

    const handleChange = (prop) => (event) => {
        if (prop === 'from' || prop === 'to') {
            const selectedItem = fromTo.find(item => item.id === event.target.value);
            setMaterialMovement({ ...materialMovement, [prop]: selectedItem });
        } else if (prop === 'internalOrder') {
            const selectedItem = internalOrders.find(item => item.id === event.target.value);
            setMaterialMovement({ ...materialMovement, [prop]: selectedItem });
        } else if (prop === 'materialName') {
            const selectedItem = materialNames.find(item => item.id === event.target.value);
            setMaterialMovement({ ...materialMovement, [prop]: selectedItem });
        } else {
            setMaterialMovement({ ...materialMovement, [prop]: event.target.value });
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


    const handleAddMaterialMovements = async (event) => {
        event.preventDefault();
        
        if (lang === 'ar') {
            setMaterialMovement({ ...materialMovement, 
                movementType: movementTypes[movementTypesAr.indexOf(materialMovement.movementType)],
                status: statuses[statusesAr.indexOf(materialMovement.status)]
            })
        }

        setIsLoading(true)
        try {
            // @route: api/create/materialmovement
            // @description: create a new material movement
            const res = await jwtService.createItem({ 
                itemType: 'materialmovement',
                data: materialMovement
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

    const handleUpdateMaterialMovements = async (event) => {
        event.preventDefault();

        if (lang === 'ar') {
            setMaterialMovement({ ...materialMovement, 
                movementType: movementTypes[movementTypesAr.indexOf(materialMovement.movementType)],
                status: statuses[statusesAr.indexOf(materialMovement.status)]
            })
        }

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'materialmovement',
                data: {
                    data: materialMovement,
                    itemId: materialMovement.id
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


    // get the dropdown data needed
    useEffect(() => {    
        async function getData() {
            const itemTypes = ['material', 'internalorder', 'supplier', 'department', 'warehouse'];
            try {
                const res = await jwtService.getItemNames(itemTypes);
                if (res) {
                    setMaterialNames(res[0].data)
                    setInternalOrders(res[1].data)
                    // Modify and combine the last 3 types: supplier, department, and warehouse
                    const combinedData = res.slice(-3).map((res, index) => {
                        return res.data.map(item => ({
                            ...item,
                            frTo: t(itemTypes[itemTypes.length - 3 + index].toUpperCase()) 
                        }));
                    }).flat();
                    setFromTo(combinedData);
                }
                console.log(res)
            } catch (_error) {
                console.log(_error)
                showMsg(_error.message, 'error'); 
            }
        }
    
        getData();
    }, [t]);


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={mtrlMovement ? handleUpdateMaterialMovements : handleAddMaterialMovements}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="material-name-label">{t('MATERIAL_NAME')}</InputLabel>
                    <Select
                        labelId="material-name-label"
                        id="material-name"
                        value={materialMovement.materialName ? materialMovement.materialName.id : ''}
                        label={t('MATERIAL_NAME')}
                        onChange={handleChange('materialName')}
                        required
                    >
                        {
                            materialNames.map(material => (
                                <MenuItem key={material.id} value={material.id}>
                                    {material.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="from-label">{t('FROM')}</InputLabel>
                    <Select
                        labelId="from-label"
                        id="from"
                        value={materialMovement.from ? materialMovement.from.id : ""}
                        label={t('FROM')}
                        onChange={handleChange('from')}
                        required
                    >{ 
                        fromTo.map(elem => (
                            <MenuItem key={elem.id} value={elem.id}>
                                {elem.frTo + ': ' + elem.name}
                            </MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>

                {materialMovement.from && <FormControl fullWidth margin="normal">
                    <InputLabel id="to-label">{t('TO')}</InputLabel>
                    <Select
                        labelId="to-label"
                        id="to"
                        value={materialMovement.to ? materialMovement.to.id : ""}
                        label={t('TO')}
                        onChange={handleChange('to')}
                        required
                    >{ 
                        fromTo.filter(elem => elem.id !== materialMovement.from.id) // Filter out the selected 'from' element
                                .map(elem => (
                                    <MenuItem key={elem.id} value={elem.id}>
                                        {elem.frTo + ': ' + elem.name}
                                    </MenuItem>
                                ))
                    }
                    </Select>
                </FormControl>}

                <FormControl fullWidth margin="normal">
                    <InputLabel id="internal-order-label">{t('INTERNAL_ORDER')}</InputLabel>
                    <Select
                        labelId="internal-order-label"
                        id="internal-order"
                        value={materialMovement.internalOrder ? materialMovement.internalOrder.id : ''}
                        label={t('INTERNAL_ORDER')}
                        onChange={handleChange('internalOrder')}
                        required
                    >
                        {
                            internalOrders.map(internalOrder => (
                                <MenuItem key={internalOrder.id} value={internalOrder.id}>
                                    {internalOrder.name}
                                </MenuItem>
                            ))
                        } 
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="movement-type-label">{t('MOVEMENT_TYPE')}</InputLabel>
                    <Select
                        labelId="movement-type-label"
                        id="movement-type"
                        value={lang === "ar" ? movementTypesAr[movementTypes.indexOf(materialMovement.movementType)] : materialMovement.movementType}
                        label={t('MOVEMENT_TYPE')}
                        onChange={handleChange('movementType')}
                        required
                    >
                        {
                            lang === "ar" ? 
                            movementTypesAr.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                    {type}
                                </MenuItem>
                            ))
                            :
                        movementTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('QUANTITY')}
                        variant="outlined"
                        type="number"
                        value={materialMovement.quantity}
                        onChange={handleChange('quantity')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('UNIT_OF_MEASURE')}
                        variant="outlined"
                        value={materialMovement.unitOfMeasure}
                        onChange={handleChange('unitOfMeasure')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">{t('STATUS')}</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={materialMovement.status ? (lang === 'ar' ? statusesAr[statuses.indexOf(materialMovement.status)] : materialMovement.status) : (lang === 'ar' ? 'قيد الانتظار' : 'PENDING')}
                        label={t('STATUS')}
                        onChange={handleChange('status')}
                        required
                    >
                        { lang === "ar" ?
                            statusesAr.map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            ))
                            :
                        statuses.map((status, index) => (
                            <MenuItem key={index} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('NOTES')}
                        variant="outlined"
                        value={materialMovement.notes}
                        onChange={handleChange('notes')}
                        multiline
                        rows={2}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {mtrlMovement ? (isLoading ? t('UPDATING') : t('UPDATE_MATERIAL_MOVEMENT_BUTTON')) : (isLoading ? t('ADDING') : t('ADD_MATERIAL_MOVEMENT_BUTTON')) }
                </button>

            </form>
        </Box>
    );
}

export default AddMaterialMovement;

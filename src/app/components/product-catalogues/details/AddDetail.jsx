import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';






function AddDetails({ dtl }) {

    const { t, i18n } = useTranslation('detailsPage');

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [catalogs, setCatalogs] = useState([]);
    const [textiles, setTextiles] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [templateTypes, setTemplateTypes] = useState([]);
    const [categoriesOne, setCategoriesOne] = useState([]);
    const [categoriesTwo, setCategoriesTwo] = useState([]);

    const [details, setDetails] = useState({
        id: dtl ? dtl.id : '',
        category1: dtl ? dtl.category1 : '',
        category2: dtl ? dtl.category2 : '',
        season: dtl ? dtl.season : '',
        textile: dtl ? dtl.textile : '',
        templateCatalog: dtl ? dtl.templateCatalog : '',
        templateType: dtl ? dtl.templateType : '',
        standardWeight: dtl ? dtl.standardWeight : '',
        grammage: dtl ? dtl.grammage : '',
        description: dtl ? dtl.description : ''
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

    const handleChange = (prop) => (event) => {
        if (prop === 'category1') { 
            const ctgr1 = categoriesOne.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: ctgr1 });
        } else if (prop === 'category2') {
            const ctgr2 = categoriesTwo.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: ctgr2 });
        } else if (prop === 'season') {
            const seasn = seasons.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: seasn });
        } else if (prop === 'textile') {
            const txtle = textiles.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: txtle });
        } else if (prop === 'templateCatalog') {
            const ctlg = catalogs.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: ctlg });
        } else if (prop === 'templateType') {
            const tmple = templateTypes.find(supplier => supplier.id === event.target.value);
            setDetails({ ...details, [prop]: tmple });
        } else {
            setDetails({ ...details, [prop]: event.target.value });
        }
    };


    const handleAddCatalogueDetails = async (event) => {
        event.preventDefault();
        
        setIsLoading(true)
        try {
            const res = await jwtService.createItem({ 
                itemType: 'productcatalogtdetail',
                data: details
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

    const handleUpdateCatalogueDetails = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'productcatalogtdetail',
                data: {
                    data: details,
                    itemId: details.id
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
        async function getDetailsData() {
            try {
                const res = await jwtService.getItemNames([
                    'productcatalog', 'season', 
                    'productcatalogtextile', 'templatetype',
                    'productcatalogcategoryone', 'productcatalogcategorytwo'
                ]);
                if (res) {
                    setCatalogs(res[0].data)
                    setSeasons(res[1].data)
                    setTextiles(res[2].data)
                    setTemplateTypes(res[3].data)
                    setCategoriesOne(res[4].data)
                    setCategoriesTwo(res[5].data)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getDetailsData();
    }, []);




    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dtl ? handleUpdateCatalogueDetails : handleAddCatalogueDetails}>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-select-label">{t('PRODUCT_CATALOGUE')}</InputLabel>
                    <Select
                        labelId="category1-select-label"
                        id="category1-select"
                        value={details.templateCatalog ? details.templateCatalog.id : ''}
                        label={t('PRODUCT_CATALOGUE')}
                        onChange={handleChange('templateCatalog')}
                        required
                    >
                        { 
                            catalogs.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category1-select-label">{t('CATEGORY_1')}</InputLabel>
                    <Select
                        labelId="category1-select-label"
                        id="category1-select"
                        value={details.category1 ? details.category1.id : ''}
                        label={t('CATEGORY_1')}
                        onChange={handleChange('category1')}
                        required
                    >
                        { 
                            categoriesOne.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category2-select-label">{t('CATEGORY_2')}</InputLabel>
                    <Select
                        labelId="category2-select-label"
                        id="category2-select"
                        value={details.category2 ? details.category2.id : ''}
                        label={t('CATEGORY_2')}
                        onChange={handleChange('category2')}
                        required
                    >
                        { 
                            categoriesTwo.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="season-select-label">{t('SEASON')}</InputLabel>
                    <Select
                        labelId="season-select-label"
                        id="season-select"
                        value={details.season ? details.season.id : ''}
                        label={t('SEASON')}
                        onChange={handleChange('season')}
                        required
                    >
                        { 
                            seasons.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                <InputLabel id="season-select-label">{t('TEXTILE')}</InputLabel>
                    <Select
                        labelId="season-select-label"
                        id="textile-select"
                        value={details.textile ? details.textile.id : ''}
                        label={t('TEXTILE')}
                        onChange={handleChange('textile')}
                        required
                    >
                        { 
                            textiles.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                <InputLabel id="season-select-label">{t('TEMPLATE_TYPE')}</InputLabel>
                    <Select
                        labelId="season-select-label"
                        id="templateType-select"
                        value={details.templateType ? details.templateType.id : ''}
                        label={t('TEMPLATE_TYPE')}
                        onChange={handleChange('templateType')}
                        required
                    >
                        { 
                            templateTypes.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('STANDARD_WEIGHT')}
                        variant="outlined"
                        type="number"
                        value={details.standardWeight}
                        onChange={handleChange('standardWeight')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('GRAMMAGE')}
                        variant="outlined"
                        type="number"
                        value={details.grammage}
                        onChange={handleChange('grammage')}
                        required
                        inputProps={{ min: 0 }}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={details.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={2}
                    />
                </FormControl>

                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {dtl ? (isLoading ? t('UPDATING') : t('UPDATE_DETAIL')) : (isLoading ? t('ADDING') : t('ADD_DETAIL'))}
                </button>
            </form>
        </Box>
    );
}

export default AddDetails;

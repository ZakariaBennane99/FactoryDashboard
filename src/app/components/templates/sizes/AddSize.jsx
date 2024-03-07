import { useState, useEffect } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';





function AddTemplateSize({ sze }) {

    const { t, i18n } = useTranslation('sizesPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [templateSize, setTemplateSize] = useState({
        id: sze ? sze.Id : '',
        size: sze ? sze.Size : '',
        template: sze ? sze.Template : '',
        templateSizeType: sze ? sze.TemplateSizeType : '',
        description: sze ? sze.description : '',
        components: sze ? sze.components : [], // array
        measurements: sze ? sze.measurement : [], // array
    });   

    const templateSizeTypes = ['Cutting', 'Dressup'];
    const templateSizeTypesAr = ['قص', 'تجهيز'];

    const handleComponentChange = (index, prop) => (event) => {
        const updatedComponents = templateSize.components.map((component, i) => {
            if (i === index) {
                return { ...component, [prop]: event.target.value };
            }
            return component;
        });
        setTemplateSize({ ...templateSize, components: updatedComponents });
    };

    const addComponent = () => {
        setTemplateSize({
            ...templateSize,
            components: [...templateSize.components, { 
                ComponentName: '', 
                ComponentName: '', 
                Material: '', 
                Template: '', 
                Quantity: '', 
                UnitOfMeasure: '' }]
        });
    };

    const handleMeasurementChange = (index, prop) => (event) => {
        const updatedMeasurements = templateSize.measurements.map((measurement, i) => {
            if (i === index) {
                return { ...measurement, [prop]: event.target.value };
            }
            return measurement;
        });
        setTemplateSize({ ...templateSize, measurements: updatedMeasurements });
    };

    const addMeasurement = () => {
        setTemplateSize({
            ...templateSize,
            measurements: [...templateSize.measurements, { 
                MeasurementName: '', 
                MeasurementValue: '', 
                MeasurementUnit:'' }]
        });
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

    const handleAddSizes = async (event) => {
        event.preventDefault();
        if (lang === 'ar') {
            setTemplateSize({ ...templateSize, 
                templateSizeType: templateSizeTypes[templateSizeTypesAr.indexOf(templateSize.templateSizeType)] });
        }
        try {
            setIsLoading(true)
            const res = await jwtService.createItem({ 
                itemType: 'templatesize',
                data: templateSize,
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

    const handleUpdateSizes = async (event) => {
        event.preventDefault();

        if (lang === 'ar') {
            setTemplateSize({ ...templateSize, 
                templateSizeType: templateSizeTypes[templateSizeTypesAr.indexOf(templateSize.templateSizeType)] });
        }
        setIsLoading(true)
        try {
            // @route: api/update/sizes
            // @description: update an existing template size
            const res = await jwtService.updateItem({ 
                itemType: 'templatesize',
                data: {
                    data: templateSize,
                    itemId: templateSize.id
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

    // You need to fetch: templates, sizes, and materisl
    const [templates, setTemplates] = useState([])    
    const [sizes, setSizes] = useState([])    
    const [materials, setMaterials] = useState([]) 

    const handleChange = (prop) => (event) => {
        if (['size', 'template', 'Material'].includes(prop)) {
            let selectedOption;
            if (prop === 'size') {
                selectedOption = sizes.find(size => size.id === event.target.value);
            } else if (prop === 'template') {
                selectedOption = templates.find(template => template.id === event.target.value);
            } else if (prop === 'Material') { // Ensure this matches the exact property name expected
                selectedOption = materials.find(material => material.id === event.target.value);
            }
            setTemplateSize({ ...templateSize, [prop]: selectedOption });
        } else {
            setTemplateSize({ ...templateSize, [prop]: event.target.value });
        }
    };

        
    useEffect(() => {    
        async function getData() {
            const itemTypes = ['material', 'template', 'size'];
            try {
                const res = await jwtService.getItemNames(itemTypes);
                if (res) {
                    setMaterials(res[0].data)
                    setTemplates(res[1].data)
                    setSizes(res[2].data)
                }
                console.log(res)
            } catch (_error) {
                showMsg(_error.message, 'error'); 
            }
        }
    
        getData();
    }, []);



    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={sze ? handleUpdateSizes : handleAddSizes}>
            <FormControl fullWidth margin="normal">
                    <InputLabel id="size-select-label">{t('SIZE')}</InputLabel>
                    <Select
                        labelId="size-select-label"
                        id="size-select"
                        value={templateSize.size ? templateSize.size.id : ''}
                        label={t('SIZE')}
                        onChange={handleChange('size')}
                        required
                    >
                        {sizes.map((size, index) => (
                            <MenuItem key={size.id} value={size.id}>
                                {size.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-select-label">{t('TEMPLATE')}</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        value={templateSize.template ? templateSize.template.id : ''}
                        label={t('TEMPLATE')}
                        onChange={handleChange('template')}
                        required
                    >
                        {templates.map((template, index) => (
                            <MenuItem key={template.id} value={template.id}>
                                {template.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-size-type-select-label">{t('TEMPLATE_SIZE_TYPE')}</InputLabel>
                    <Select
                        labelId="template-size-type-select-label"
                        id="template-size-type-select"
                        value={templateSize.templateSizeType}
                        label={t('TEMPLATE_SIZE_TYPE')}
                        onChange={handleChange('templateSizeType')}
                        required
                    >
                        {templateSizeTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {templateSize.measurements && templateSize.measurements.map((measurement, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <h4 style={{ fontWeight: 'bold' }}>{t('MEASUREMENT')} {index + 1}</h4>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="measurement-value-input"
                                label={t('MEASUREMENT_NAME')}
                                variant="outlined"
                                value={measurement.MeasurementName}
                                onChange={handleMeasurementChange(index, 'MeasurementName')}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="measurement-value-input"
                                label={t('MEASUREMENT_VALUE')}
                                variant="outlined"
                                value={measurement.MeasurementValue}
                                onChange={handleMeasurementChange(index, 'MeasurementValue')}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="measurement-value-input"
                                label={t('MEASUREMENT_UNIT')}
                                variant="outlined"
                                value={measurement.MeasurementUnit}
                                onChange={handleMeasurementChange(index, 'MeasurementUnit')}
                                required
                            />
                        </FormControl>
        
                    </Box>
                ))}

                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('DESCRIPTION')}
                        variant="outlined"
                        value={templateSize.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={3}
                        required
                    />
                </FormControl>

                {templateSize.components && templateSize.components.map((component, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <h4 style={{ fontWeight: 'bold' }}>{t('COMPONENT')} {index + 1}</h4>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label={t('COMPONENT_NAME')}
                                variant="outlined"
                                value={component.ComponentName}
                                onChange={handleComponentChange(index, 'ComponentName')}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label={t('DESCRIPTION')}
                                variant="outlined"
                                value={component.Description}
                                onChange={handleComponentChange(index, 'Description')}
                                required
                                multiline
                                rows={3}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`material-select-label-${index}`}>{t('MATERIAL')}</InputLabel>
                            <Select
                                labelId={`material-select-label-${index}`}
                                id={`material-select-${index}`}
                                value={component.Material ? component.Material.id : ''}
                                label={t('MATERIAL')}
                                onChange={handleComponentChange(index, 'Material')}
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
                            <InputLabel id={`template-select-label-${index}`}>{t('TEMPLATE')}</InputLabel>
                            <Select
                                labelId={`template-select-label-${index}`}
                                id={`template-select-${index}`}
                                value={component.Template ? component.Template.id : ''}
                                label={t('TEMPLATE')}
                                onChange={handleComponentChange(index, 'Template')}
                                required
                            >
                                {templates.map((template, i) => (
                                    <MenuItem key={template.id} value={template.id}>
                                        {template.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label={t('QUANTITY')}
                                variant="outlined"
                                value={component.Quantity}
                                onChange={handleComponentChange(index, 'quantity')}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label={t('UNIT_OF_MEASURE')}
                                variant="outlined"
                                value={component.UnitOfMeasure}
                                onChange={handleComponentChange(index, 'UnitOfMeasure')}
                                required
                            />
                        </FormControl>
                    </Box>
                ))}

                <div className="add-new-component-container">
                    <div>
                        <IconButton onClick={addComponent} color="primary" aria-label="add component">
                         <AddCircleOutlineIcon />
                        </IconButton>
                        <span>
                            {t('ADD_COMPONENT')}
                        </span>
                    </div>
                    <div>
                        <IconButton onClick={addMeasurement} color="primary" aria-label="add component">
                         <AddCircleOutlineIcon />
                        </IconButton>
                        <span>
                            {t('ADD_MEASUREMENT')}
                        </span>
                    </div>
                </div>


                <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {sze ? (isLoading ? t('UPDATING') : t('UPDATE_TEMPLATE_SIZE')) : (isLoading ? t('ADDING') : t('ADD_TEMPLATE_SIZE'))}
                </button>
            </form>
        </Box>
    );
}

export default AddTemplateSize;
import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';




function AddTemplateSize({ sze }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [templateSize, setTemplateSize] = useState({
        size: sze ? sze.size : '',
        template: sze ? sze.template : '',
        templateSizeType: sze ? sze.templateSizeType : '',
        measurementName: sze ? sze.measurementName : '',
        measurementValue: sze ? sze.measurementValue : '',
        measurementUnit: sze ? sze.measurementUnit : '',
        components: sze ? sze.components : [],
        measurements: sze ? sze.measurement : [],
        description: sze ? sze.description : ''
    });

    const [templates, setTemplates] = useState([
        'Basic Tee',
        'Winter Sweater',
        'Sports Jacket',
    ])    
    const [materials, setMaterials] = useState([
        'Cotton',
        'Polyester',
        'Wool',
    ])    
    const [measurementNames, setMeasurementNames] = useState(['pcs', 'meters', 'kg'])
    const [measurementUnits, setMeasurementUnits] = useState(['inches', 'cm'])
    const [sizes, setSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL'])

    const templateSizeTypes = ['Cutting', 'Dressup'];

    const handleChange = (prop) => (event) => {
        setTemplateSize({ ...templateSize, [prop]: event.target.value });
    };

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
            components: [...templateSize.components, { componentName: '', description: '', material: '', template: '', quantity: '', unitOfMeasure: '' }]
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
            measurements: [...templateSize.measurements, { measurementName: '', measurementUnits: '', measurementValue:'' }]
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
        
        try {
            // @route: api/create/sizes
            // @description: create a new template size
            const res = await jwtService.createItem({ 
                itemType: 'sizes',
                data: {
                    data: templateSize,
                    currentUserId: currentUserId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                showMsg(res, 'success')
            }
        } catch (_error) {
            showMsg(_error, 'error')
        } 
    };

    const handleUpdateSizes = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/sizes
            // @description: update an existing template size
            const res = await jwtService.updateItem({ 
                itemType: 'sizes',
                data: {
                    data: templateSize,
                    currentUserId: currentUserId,
                    itemId: sze.sizesId
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
    // get the list of existing template data above
    useEffect(() => {    
        async function getTemplateData() {
            try {
                // @route: api/templateData
                // @description: get the template data above each in an array
                // and all of them should be in an object
                // @response: return an object of two arrays 
                const res = await jwtService.getTemplateData({ 
                    currentUserId: currentUserId
                });
                if (res) {
                    setMaterials(res.materials)
                    setTemplates(res.templates)
                    setSizes(res.sizes)
                    setMeasurementNames(res.measurementNames)
                    setMeasurementUnits(res.measurementUnits)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            }
        }
        
        getTemplateData();
    }, []);*/



    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={sze ? handleUpdateSizes : handleAddSizes}>
            <FormControl fullWidth margin="normal">
                    <InputLabel id="size-select-label">Size</InputLabel>
                    <Select
                        labelId="size-select-label"
                        id="size-select"
                        value={templateSize.size}
                        label="Size"
                        onChange={handleChange('size')}
                        required
                    >
                        {sizes.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-select-label">Template</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        value={templateSize.template}
                        label="Template"
                        onChange={handleChange('template')}
                        required
                    >
                        {templates.map((template, index) => (
                            <MenuItem key={index} value={template}>
                                {template}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="template-size-type-select-label">Template Size Type</InputLabel>
                    <Select
                        labelId="template-size-type-select-label"
                        id="template-size-type-select"
                        value={templateSize.templateSizeType}
                        label="Template Size Type"
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
                        <h4 style={{ fontWeight: 'bold' }}>Measurement {index + 1}</h4>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="measurement-name-select-label">Measurement Name</InputLabel>
                            <Select
                                labelId="measurement-name-select-label"
                                id="measurement-name-select"
                                value={measurement.measurementName}
                                label="Measurement Name"
                                onChange={handleMeasurementChange(index, 'measurementName')}
                                required
                            >
                                {measurementNames.map((name, i) => (
                                    <MenuItem key={i} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="measurement-value-input"
                                label="Measurement Value"
                                variant="outlined"
                                value={measurement.measurementValue}
                                onChange={handleMeasurementChange(index, 'measurementValue')}
                                required
                            />
                        </FormControl>
        
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`measurement-unit-select-label`}>Measurement Unit</InputLabel>
                            <Select
                                labelId={`measurement-unit-select-label`}
                                id={`measurement-unit-select`}
                                value={measurement.measurementUnit}
                                label="Measurement Unit"
                                onChange={handleMeasurementChange(index, 'measurementUnit')}
                                required
                            >
                                {measurementUnits.map((unit, i) => (
                                    <MenuItem key={i} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                ))}

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Description"
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
                        <h4 style={{ fontWeight: 'bold' }}>Component {index + 1}</h4>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Component Name"
                                variant="outlined"
                                value={component.componentName}
                                onChange={handleComponentChange(index, 'componentName')}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Description"
                                variant="outlined"
                                value={component.description}
                                onChange={handleComponentChange(index, 'description')}
                                required
                                multiline
                                rows={3}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`material-select-label-${index}`}>Material</InputLabel>
                            <Select
                                labelId={`material-select-label-${index}`}
                                id={`material-select-${index}`}
                                value={component.material}
                                label="Material"
                                onChange={handleComponentChange(index, 'material')}
                                required
                            >
                                {materials.map((material, i) => (
                                    <MenuItem key={i} value={material}>
                                        {material}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`template-select-label-${index}`}>Template</InputLabel>
                            <Select
                                labelId={`template-select-label-${index}`}
                                id={`template-select-${index}`}
                                value={component.template}
                                label="Template"
                                onChange={handleComponentChange(index, 'template')}
                                required
                            >
                                {templates.map((template, i) => (
                                    <MenuItem key={i} value={template}>
                                        {template}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Quantity"
                                variant="outlined"
                                value={component.quantity}
                                onChange={handleComponentChange(index, 'quantity')}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id={`unit-of-measure-select-label-${index}`}>Unit of Measure</InputLabel>
                            <Select
                                labelId={`unit-of-measure-select-label-${index}`}
                                id={`unit-of-measure-select-${index}`}
                                value={component.unitOfMeasure}
                                label="Unit of Measure"
                                onChange={handleComponentChange(index, 'unitOfMeasure')}
                                required
                            >
                                {unitsOfMeasure.map((unit, i) => (
                                    <MenuItem key={i} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                ))}

                <div className="add-new-component-container">
                    <div>
                        <IconButton onClick={addComponent} color="primary" aria-label="add component">
                         <AddCircleOutlineIcon />
                        </IconButton>
                        <span>
                            Add Component
                        </span>
                    </div>
                    <div>
                        <IconButton onClick={addMeasurement} color="primary" aria-label="add component">
                         <AddCircleOutlineIcon />
                        </IconButton>
                        <span>
                            Add Measurement
                        </span>
                    </div>
                </div>

                <button type="submit" className="add-internalOrder-btn">{sze ? 'Update' : 'Add'} Size</button>
            </form>
        </Box>
    );
}

export default AddTemplateSize;
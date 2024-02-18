import { useState } from 'react';
import { FormControl, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function AddDetails({ dtl }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [details, setDetails] = useState({
        category1: dtl ? dtl.Category1 : '',
        category2: dtl ? dtl.Category2 : '',
        season: dtl ? dtl.Season : '',
        textile: dtl ? dtl.Textile : '',
        templatePattern: dtl ? dtl.TemplatePattern : '',
        templateType: dtl ? dtl.TemplateType : '',
        standardWeight: dtl ? dtl.StandardWeight : '',
        grammage: dtl ? dtl.Grammage : '',
        description: dtl ? dtl.Description : ''
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
        setDetails({ ...details, [prop]: event.target.value });
    };


    const handleAddCatalogueDetails = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/catalogueDetails
            // @description: create a new catalogueDetails
            const res = await jwtService.createItem({ 
                itemType: 'catalogueDetails',
                data: {
                    data: catalogueDetails,
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

    const handleUpdateCatalogueDetails = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/catalogueDetails
            // @description: update catalogue details
            const res = await jwtService.updateItem({ 
                itemType: 'catalogueDetails',
                data: {
                    data: catalogueDetails,
                    currentUserId: currentUserId,
                    itemId: dtl.catalogueDetailsId
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


    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={dtl ? handleUpdateCatalogueDetails : handleAddCatalogueDetails}>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="product-catalogue-select-label">Product Catalogue</InputLabel>
                    <Select
                        labelId="category2-select-label"
                        id="category2-select"
                        value={details.category2}
                        label="Category 2"
                        onChange={handleChange('category2')}
                        required
                    >
                        <MenuItem value="Jeans">Jeans</MenuItem>
                        <MenuItem value="Shorts">Shorts</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category1-select-label">Category 1</InputLabel>
                    <Select
                        labelId="category1-select-label"
                        id="category1-select"
                        value={details.category1}
                        label="Category 1"
                        onChange={handleChange('category1')}
                        required
                    >
                        <MenuItem value="Tops">Tops</MenuItem>
                        <MenuItem value="Bottoms">Bottoms</MenuItem>
                        {/* ... other categories */}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="category2-select-label">Category 2</InputLabel>
                    <Select
                        labelId="category2-select-label"
                        id="category2-select"
                        value={details.category2}
                        label="Category 2"
                        onChange={handleChange('category2')}
                        required
                    >
                        <MenuItem value="Jeans">Jeans</MenuItem>
                        <MenuItem value="Shorts">Shorts</MenuItem>
                        {/* ... other subcategories */}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="season-select-label">Season</InputLabel>
                    <Select
                        labelId="season-select-label"
                        id="season-select"
                        value={details.season}
                        label="Season"
                        onChange={handleChange('season')}
                        required
                    >
                        <MenuItem value="Summer">Summer</MenuItem>
                        <MenuItem value="Winter">Winter</MenuItem>
                        {/* ... other seasons */}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Textile"
                        variant="outlined"
                        value={details.textile}
                        onChange={handleChange('textile')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Pattern"
                        variant="outlined"
                        value={details.templatePattern}
                        onChange={handleChange('templatePattern')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Template Type"
                        variant="outlined"
                        value={details.templateType}
                        onChange={handleChange('templateType')}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Standard Weight (g)"
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
                        label="Grammage (g/m²)"
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
                        label="Description"
                        variant="outlined"
                        value={details.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={2}
                    />
                </FormControl>

                <button type="submit" className="add-details-btn">{ dtl ? 'Update' : 'Add' } Details</button>
            </form>
        </Box>
    );
}

export default AddDetails;

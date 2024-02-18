import { useState } from 'react';
import { FormControl, TextField, Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';


function AddSeason({ seasn }) {

    const currentUserId = window.localStorage.getItem('userId');

    const [season, setSeason] = useState({
        seasonName: seasn ? seasn.seasonName : '',
        startDate: seasn ? new Date(seasn.startDate) : null,
        endDate: seasn ? new Date(seasn.endDate) : null,
        description: seasn ? seasn.description : ''
    });

    const handleSeasonChange = (prop) => (event) => {
        setSeason({ ...season, [prop]: event.target.value });
    };

    const handleStartDateChange = (date) => {
        setSeason({ ...season, startDate: date });
    };

    const handleEndDateChange = (date) => {
        setSeason({ ...season, endDate: date });
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


    const handleAddSeason = async (event) => {
        event.preventDefault();
        
        try {
            // @route: api/create/season
            // @description: create a new season
            const res = await jwtService.createItem({ 
                itemType: 'seasons',
                data: {
                    data: season,
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

    const handleUpdateSeason = async (event) => {
        event.preventDefault();

        try {
            // @route: api/update/season
            // @description: update season
            const res = await jwtService.updateItem({ 
                itemType: 'seasons',
                data: {
                    data: season,
                    currentUserId: currentUserId,
                    itemId: seasn.seasonId
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={seasn ? handleUpdateSeason : handleAddSeason}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Season Name"
                            value={season.seasonName}
                            onChange={handleSeasonChange('seasonName')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Start Date"
                            value={season.startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="End Date"
                            value={season.endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label="Description"
                            value={season.description}
                            onChange={handleSeasonChange('description')}
                            multiline
                            rows={3}
                            required
                        />
                    </FormControl>

                    <button type="submit" className="add-details-btn">{seasn ? 'Update' : 'Add'} Season</button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddSeason;

import { useState } from 'react';
import { FormControl, TextField, Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';




function AddSeason({ seasn }) {

    const { t, i18n } = useTranslation('seasonsPage');
    const lang = i18n.language;

    const dispatch = useAppDispatch();
    
    const [isLoading, setIsLoading] = useState(false);

    const [season, setSeason] = useState({
        id: seasn ? seasn.id : '',
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
        
        setIsLoading(true)
        try {
            // @route: api/create/season
            // @description: create a new season
            const res = await jwtService.createItem({ 
                itemType: 'season',
                data: season
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


    const handleUpdateSeason = async (event) => {
        event.preventDefault();

        setIsLoading(true)
        try {
            const res = await jwtService.updateItem({ 
                itemType: 'season',
                data: {
                    data: season,
                    itemId: seasn.id
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

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={seasn ? handleUpdateSeason : handleAddSeason}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label={t('SEASON_NAME')}
                            value={season.seasonName}
                            onChange={handleSeasonChange('seasonName')}
                            required
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label={t('START_DATE')}
                            value={season.startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label={t('END_DATE')}
                            value={season.endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label={t('DESCRIPTION')}
                            value={season.description}
                            onChange={handleSeasonChange('description')}
                            multiline
                            rows={3}
                            required
                        />
                    </FormControl>

                    <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                        {seasn ? (isLoading ? t('UPDATING') : t('UPDATE_SEASON')) : (isLoading ? t('ADDING') : t('ADD_SEASON'))}
                    </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddSeason;

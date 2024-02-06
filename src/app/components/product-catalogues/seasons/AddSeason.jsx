import { useState } from 'react';
import { FormControl, TextField, Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AddSeason({ seasn }) {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(season);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={handleSubmit}>
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

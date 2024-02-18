import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { Box, Button, CircularProgress, FormControl, TextField, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function ReportDates({ materialId, materialName }) {

    const currentUserId = window.localStorage.getItem('userId');

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null)
    const [dates, setDates] = useState({ from: null, to: null });

    function showMsg(msg, isError) {
        dispatch(closeDialog());
        dispatch(showMessage({
            message: msg, 
            autoHideDuration: 3000, // ms
            anchorOrigin: {
                vertical: 'top', // top bottom
                horizontal: 'center' // left center right
            },
            variant: isError ? 'error' : 'info' // success error info warning null
        }));
    }

    function generatePDF(reportInfo) {
        // call the backend to generate the report 

    }
    
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setLoading(true); 
        try {
            // @route: api/getReportData
            // @description: get the data for the report
            const res = await jwtService.getReportData({
                currentUserId: currentUserId,
                materialId,
                from: dates.from,
                to: dates.to
             }, { 'Content-Type': 'application/json' });
            if (res) {
                setData(res)
            }
            setLoading(false)
        } catch (_error) {
            showMsg(_error, 'error')
            setLoading(false)
        }
    };

    const handleDateChange = (name, value) => {
        setDates((prevDates) => ({
            ...prevDates,
            [name]: value,
        }));
    };
    

    if (data) {
        return (
            <Box sx={{ width: '100%', height: '100%', margin: 'auto', padding: '15px' }}>
                <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto", borderRadius: '7px' }}>
                    <Table sx={{ minWidth: 750, width: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 130 }}>Internal Orders ID</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>Movement ID</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>From</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>To</TableCell>
                                <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>Quantity</TableCell>
                                <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>Color</TableCell>
                                <TableCell align="right" sx={{ minWidth: 120, textAlign: 'left' }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={row.internalOrdersId}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                    }}
                                >
                                    <TableCell component="th" scope="row" sx={{ minWidth: 160 }}>
                                        {row.internalOrdersId}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{row.movementId}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{row.from}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{row.to}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>{row.quantity}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>{row.color}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 120, textAlign: 'left' }}>{formatDate(row.date)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                        variant="contained"
                        color="primary"
                        onClick={() => generatePDF(data)}
                        style={{ borderRadius: '6px', width: '100%' }}
                    >
                        Download
                </Button>
            </Box>
        )
    } else {
        return (
            <LocalizationProvider >
                <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label="From"
                                value={dates.from}
                                onChange={(newValue) => handleDateChange('from', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                            <DatePicker
                                label="To"
                                value={dates.to}
                                onChange={(newValue) => handleDateChange('to', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                disabled={!dates.from} 
                                minDate={dates.from} 
                            />
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            type="submit"
                            style={{ borderRadius: '6px', width: '100%' }}
                            endIcon={loading && <CircularProgress size={20} />}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </form>
                </Box>
            </LocalizationProvider>
        );
    }
}

export default ReportDates;

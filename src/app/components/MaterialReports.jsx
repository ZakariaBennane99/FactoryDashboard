import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function MaterialReports() {
    
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [dates, setDates] = useState({ from: null, to: null });
    const [reportData, setReportData] = useState(null);


    useEffect(() => {
        // to be fetched from the backend
        setMaterials([ 
            { id: 'M001', name: 'Material 1' }, 
            { id: 'M002', name: 'Material 2' },
            { id: 'M003', name: 'Material 3' }
        ]);
    }, []);

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

    const handleMaterialChange = (_, value) => {
        setSelectedMaterials(value);
    };

    const handleDateChange = (name, value) => {
        setDates((prevDates) => ({
            ...prevDates,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // @route: api/getReportData
            // @description: get the data for the report
            const response = await jwtService.generatePDFReport({
                materialIds: selectedMaterials.map(material => material.id),
                from: dates.from,
                to: dates.to
            }, { 'Content-Type': 'application/json' });
            setReportData(response.data.reports);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 404) {
                showMsg(`There is are reports for the chosen options!`, false)
            } else {
                showMsg('There was a server error! please try again.', true)
            }
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const generatePDF = async () => {
        // call the backend to generate the report 
        setLoading(true); 

        try {
            // @route: api/generatePDFReport
            // @description: generate a downloadable PDF link for the data
            const res = await jwtService.generatePDFReport({
                currentUserId: currentUserId,
                materialIds: selectedMaterials.map(material => material.id),
                from: dates.from,
                to: dates.to
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // here open the link in a new window to get downloaded
                // setData(res)
            }
            setLoading(false)
        } catch (_error) {
            showMsg(_error, 'error')
            setLoading(false)
        }
    };


    if (reportData) {
        return (
            <Box sx={{ width: '100%', margin: 'auto', padding: '15px' }}>
                {reportData.map((materialReport) => (
                    <Box key={materialReport.materialId} sx={{ marginBottom: '40px' }}>
                        <Typography variant="h6" gutterBottom>
                            {materialReport.materialName}
                        </Typography>
                        <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto", borderRadius: '7px' }}>
                            <Table sx={{ minWidth: 750 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Internal Orders ID</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>Movement ID</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>From</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>To</TableCell>
                                        <TableCell sx={{ minWidth: 100, textAlign: 'left' }}>Quantity</TableCell>
                                        <TableCell sx={{ minWidth: 100, textAlign: 'left' }}>Color</TableCell>
                                        <TableCell sx={{ minWidth: 120, textAlign: 'left' }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {materialReport.reports.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.internalOrdersId}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>{row.movementId}</TableCell>
                                            <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>{row.from}</TableCell>
                                            <TableCell sx={{ minWidth: 130, textAlign: 'left' }}>{row.to}</TableCell>
                                            <TableCell sx={{ minWidth: 100, textAlign: 'left' }}>{row.quantity}</TableCell>
                                            <TableCell sx={{ minWidth: 100, textAlign: 'left' }}>{row.color}</TableCell>
                                            <TableCell sx={{ minWidth: 120, textAlign: 'left' }}>{formatDate(row.date)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={generatePDF}
                    sx={{ width: '100%', borderRadius: '6px' }}
                >
                Download All Reports
            </Button>
            </Box>)
    } else {
        return (
            <Box sx={{ p: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <Autocomplete
                                multiple
                                options={materials}
                                getOptionLabel={(option) => option.name}
                                onChange={handleMaterialChange}
                                style={{ borderRadius: '5px' }}
                                renderInput={(params) => <TextField {...params} label="Select Materials" />}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label="From"
                                value={dates.from}
                                onChange={(newValue) => handleDateChange('from', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
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
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !selectedMaterials.length || !dates.from || !dates.to}
                            endIcon={loading && <CircularProgress size={20} />}
                            style={{ borderRadius: '6px', width: '100%' }}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </form>
                </LocalizationProvider>
            </Box>
        );
    }
}

export default MaterialReports;

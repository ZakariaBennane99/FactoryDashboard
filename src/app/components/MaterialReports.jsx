import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from 'app/store';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import './Departments.css'
import jwtService from '../auth/services/jwtService';
import { useTranslation } from 'react-i18next';
import arLocale from 'date-fns/locale/ar-SA';



function MaterialReports() {

    const { i18n } = useTranslation();
    const lang = i18n.language;

    const localeMap = {
        ar: arLocale,
    };

    const adapterLocale = lang === 'ar' ? localeMap[lang] : undefined;
    
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [dates, setDates] = useState({ from: null, to: null });
    const [reportData, setReportData] = useState(null);


    useEffect(() => {    
        async function getMaterials() {
            try {
                const res = await jwtService.getItemNames(['material']);
                console.log('THE MATERIAL', res)
                if (res[0].status === 200) {
                    setMaterials(res[0].data)
                }
            } catch (_error) {
                showMsg(_error.message || "An unexpected error occurred", 'error')
            } 
        }
        
        getMaterials();
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
            const res = await jwtService.handleReports({
                itemType: 'generateReports',
                data: {
                    materialIds: materials.map(material => material.id),
                    from: dates.from,
                    to: dates.to
                }
            });
            console.log('THE GENeRATE RES', res)
            if (res.status === 200) {
                setReportData(res.data)
            }
        } catch (error) {
            showMsg(error.message, 'error')
        } finally {
            setLoading(false)
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const downloadPDF = async () => {
        // call the backend to generate the report 
        setLoading(true); 

        try {
            const res = await jwtService.handleReports({
                itemType: 'downloadReports',
                data: {
                    materialIds: materials.map(material => material.id),
                    from: dates.from,
                    to: dates.to
                }
            });
            if (res) {
                const url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.pdf');
                link.setAttribute('target', '_blank'); // Open in a new tab/window
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
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
                                    <TableCell>{lang === 'ar' ? 'معرف الطلبات الداخلية' : 'Internal Orders ID'}</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'معرف الحركة' : 'Movement ID'}</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'من' : 'From'}</TableCell>
                                        <TableCell sx={{ minWidth: 130, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'إلى' : 'To'}</TableCell>
                                        <TableCell sx={{ minWidth: 100, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الكمية' : 'Quantity'}</TableCell>
                                        <TableCell sx={{ minWidth: 100, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اللون' : 'Color'}</TableCell>
                                        <TableCell sx={{ minWidth: 120, textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</TableCell>
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
                    className={loading ? 'disabled-button' : ''}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={downloadPDF}
                    sx={{ width: '100%', borderRadius: '6px' }}
                >
                {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل الكل' : 'Download All')}
            </Button>
            </Box>)
    } else {
        return (
            <Box sx={{ p: 4, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <Autocomplete
                                multiple
                                options={materials}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => handleMaterialChange(event, value)}
                                style={{ borderRadius: '5px' }}
                                renderInput={(params) => <TextField {...params} label={lang === 'ar' ? 'اختر المواد' : 'Select Materials'} />}
                                getOptionSelected={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label={lang === 'ar' ? '' : 'From'}
                                value={dates.from}
                                onChange={(newValue) => handleDateChange('from', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label={lang === 'ar' ? '' : 'To'}
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
                             {loading ? (lang === 'ar' ? 'جاري الإعداد...' : 'Generating...') : (lang === 'ar' ? 'إعداد التقرير' : 'Generate Report')}
                        </Button>
                    </form>
                </LocalizationProvider>
            </Box>
        );
    }
}

export default MaterialReports;

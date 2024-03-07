import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, FormControl, TextField, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import jwtService from '../../../../app/auth/services/jwtService';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';
import arLocale from 'date-fns/locale/ar-SA';
import '../../Departments.css'



function ReportDates({ materialId }) {

    const { i18n } = useTranslation();
    const lang = i18n.language;

    const localeMap = {
        ar: arLocale,
    };

    const adapterLocale = lang === 'ar' ? localeMap[lang] : undefined;

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

    async function downloadPDF() {

        setLoading(true); 
        
        try {
            const res = await jwtService.handleReports({
                itemType: 'downloadReport',
                data: {
                    materialId,
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
            console.log('The error', _error)
            showMsg(_error.message, 'error')
        } finally {
            setLoading(false)
        }
    }
    
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    const handleSubmit = async (event) => {
        // generate data requested
        event.preventDefault();

        setLoading(true); 
        try {
            const res = await jwtService.handleReports({
                itemType: 'generateReport',
                data: {
                    materialId,
                    from: dates.from,
                    to: dates.to
                }
             });
            if (res.status === 200) {
                console.log('the data', res.data)
                setData(res.data)
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
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
                                <TableCell sx={{ minWidth: 130 }}>{lang === 'ar' ? "معرف الطلبات الداخلية" : 'Internal Orders ID'}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{lang === 'ar' ?  "معرف الحركة" : 'Movement ID'}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{lang === 'ar' ?  "من" : 'From'}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 130, textAlign: 'left' }}>{lang === 'ar' ? "إلى" : 'To'}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>{lang === 'ar' ?  "الكمية" : "Quantity"}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 100, textAlign: 'left' }}>{lang === 'ar' ?  "اللون" : "Color"}</TableCell>
                                <TableCell align="right" sx={{ minWidth: 120, textAlign: 'left' }}>{lang === 'ar' ?  "التاريخ" : "Date"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={`${row.internalOrdersId}-${row.movementId}`}
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
                        className={loading ? 'disabled-button' : ''}
                        variant="contained"
                        color="primary"
                        onClick={downloadPDF}
                        disabled={loading}
                        style={{ borderRadius: '6px', width: '100%' }}
                    >
                       {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل' : 'Download')} 
                </Button>
            </Box>
        )
    } else {
        return (
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px', direction: lang === 'ar' ? 'rtl' : 'ltr'  }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label={lang === 'ar' ? "" : 'From'}
                                value={dates.from}
                                onChange={(newValue) => handleDateChange('from', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                            <DatePicker
                                label={lang === 'ar' ? "" : 'To'}
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
                        >
                            {loading ? (lang === 'ar' ? 'جاري الإعداد...' : 'Generating...') : (lang === 'ar' ? 'إعداد التقرير' : 'Generate Report')}
                        </Button>
                    </form>
                </LocalizationProvider>
            </Box>
        );
    }
}

export default ReportDates;

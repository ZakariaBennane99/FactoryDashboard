import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { Box, Button, CircularProgress, FormControl, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import jsPDF from 'jspdf';



function ReportDates({ materialId, materialName }) {

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

    function generatePDF(reportData) {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const titlePadding = 50; // Padding at the top for the title
        const sidePadding = 30; // Padding on the sides
        const startY = titlePadding + 30; // Starting Y position for the table
        const lineHeight = 15; // Line height for table rows
        const columnWidths = [95, 80, 95, 90, 60, 50, 70]; // Define column widths, ensure they add up to less than page width
    
        // Calculate start positions of each column based on widths
        const columnStartPositions = columnWidths.map((width, index) => {
            return columnWidths.slice(0, index).reduce((acc, val) => acc + val, sidePadding);
        });
    
        // Title
        const title = `Report For ${materialName}(${materialId}) From ${formatDate(dates.from)} To ${formatDate(dates.to)}`;
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(title, pageWidth / 2, titlePadding, { align: 'center' });
    
        // Table headers
        const headers = ["Internal Orders ID", "Movement ID", "From", "To", "Quantity", "Color", "Date"];
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        headers.forEach((header, i) => {
            pdf.text(header, columnStartPositions[i], startY);
        });
    
        // Draw lines for the header
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.1);
        pdf.line(sidePadding, startY + 5, pageWidth - sidePadding, startY + 5); 
    
        // Table rows
        let yPos = startY + 10;
        pdf.setFont(undefined, 'normal');
        reportData.forEach((item, index) => {
            const { internalOrdersId, movementId, from, to, quantity, color, date } = item;
            const row = [internalOrdersId, movementId, from, to, quantity, color, formatDate(date)];
            row.forEach((text, i) => {
                pdf.text(String(text), columnStartPositions[i], yPos);
            });
    
            yPos += lineHeight;
            pdf.line(sidePadding, yPos, pageWidth - sidePadding, yPos); 
        });
    
        // Save the PDF
        pdf.save(`Report_For_${materialName}(${materialId})_From_${formatDate(dates.from)}_To_${formatDate(dates.to)}.pdf`);
    }
    
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:3050/generate-report', {
                materialId,
                from: dates.from,
                to: dates.to
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const dt = response.data.report
            // show the table first 
            setData(dt)
        } catch (error) {
            console.log('THE ERROR', error)
            if (error.response && error.response.status === 404) {
                showMsg(`There is no report for ${materialName} on these dates!`, false)
            } else {
                showMsg('There was a server error! please try again.', true)
            }
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

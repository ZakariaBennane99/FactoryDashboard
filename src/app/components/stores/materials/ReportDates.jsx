import { useState, useEffect } from 'react';
import { FormControl, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { setDefaultResultOrder } from 'dns';
import { usePDF } from 'react-to-pdf';


function ReportDates({ materialId }) {

    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

    const table = (content) => {
        return (
            <div ref={targetRef}>
                {content}
            </div>
        )
    }

    const [clickedGenerate, setClickedGenerate] = useState(false)

    const [dates, setDates] = useState({
        from: null,
        to: null
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(material);
    };

    useEffect(() => {
        if (clickedGenerate) {
            async function generateReport() {
                try {
                    // you need a POST request to post the dates 
                    // FROM() TO() and fetch back the internal 
                    // movements of this materialId (props) 
                    const response = await axios.get('http://localhost:3050/generate-report');
                    console.log('The response', response.report)

                } catch (error) {
                    console.error('There was an error!', error);
                }
            }
            generateReport()
        }

    }, [clickedGenerate])




    return (
        <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
            <form onSubmit={handleSubmit}>

                <FormControl fullWidth margin="normal">
                    <DatePicker
                        label="From"
                        value={dates.from}
                        onChange={(e) => { setDates({
                            ...dates, from: e.target.value
                        }) }}
                        renderInput={(params) => <TextField {...params} required />}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <DatePicker
                        label="To"
                        value={dates.to}
                        onChange={(e) => { setDates({
                            ...dates, to: e.target.value
                        }) }}
                        renderInput={(params) => <TextField {...params} required />}
                    />
                </FormControl>

                <button type="submit" className="add-material-btn" onClick={() => setClickedGenerate(true) }>Generate</button>
            </form>
        </Box>
    );
}

export default ReportDates;
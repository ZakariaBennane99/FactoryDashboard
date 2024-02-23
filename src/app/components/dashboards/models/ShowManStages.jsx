import { useState, useEffect } from 'react';
import jwtService from '../../../auth/services/jwtService'; 
import { 
    Accordion, AccordionSummary, 
    AccordionDetails, Typography, Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import InfoIcon from '@mui/icons-material/Info'; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import PlusOneIcon from '@mui/icons-material/PlusOne'



const ShowManStages = ({ modelId, quantity }) => {

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
      const fetchModelTrackings = async () => {
        try {
          const response = await jwtService.getModelTrackings({ 
            modelId: modelId
          });
          const data = response.data;
          organizeDataByDepartment(data);
        } catch (error) {
          console.error('Error fetching model trackings:', error);
        }
      };
  
      fetchModelTrackings();
    }, [modelId]);

    const organizeDataByDepartment = (data) => {
      const departmentMap = data.reduce((acc, item) => {
        if (!acc[item.department]) {
          acc[item.department] = [];
        }
        acc[item.department].push(item);
        return acc;
      }, {});
  
      setDepartments(Object.entries(departmentMap));
    };

  return (
    <Box sx={{ width: 250, maxWidth: 500, margin: 'auto', padding: '15px' }}>
      {departments.map(([departmentName, details], index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{departmentName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {details.map((detail, detailIndex) => (
                <li key={detailIndex} style={{ 
                    display: 'flex', gap: '10px',
                    flexDirection: "column" }}>
                    <Box display="flex" alignItems="center">
                      <CheckCircleIcon color="success" /><Typography sx={{ ml: 1.5 }} variant="body2">{detail.status}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <InfoIcon color="info" /><Typography sx={{ ml: 1.5 }} variant="body2">{detail.modelId}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <LocalShippingIcon color="primary" /><Typography sx={{ ml: 1.5 }} variant="body2">{detail.quantityDelivered}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <ReceiptIcon color="secondary" /><Typography sx={{ ml: 1.5 }} variant="body2">{detail.quantityReceived}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <PlusOneIcon /><Typography sx={{ ml: 1.5 }} variant="body2">{quantity}</Typography>
                    </Box>
                </li>
                ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ShowManStages;
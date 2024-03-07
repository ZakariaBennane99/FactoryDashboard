import { useState, useEffect } from 'react';
import jwtService from '../../../auth/services/jwtService'; 
import { 
    Accordion, AccordionSummary, 
    AccordionDetails, Typography, Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import {
  CheckCircleOutline as CompletedIcon,
  HourglassEmpty as PendingIcon,
  ThumbUpAltOutlined as ApprovedIcon,
  Loop as OngoingIcon
} from '@mui/icons-material';



const ShowManStages = ({ modelId, quantity }) => {

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
      const fetchModelTrackings = async () => {
        try {
          const response = await jwtService.getItemById({ 
            itemType: 'trackingmodels',
            itemId: modelId
          });
          console.log('THE ARRAY', response.data)
          organizeDataByDepartment(response.data);
        } catch (error) {
          console.error('Error fetching model trackings:', error);
        }
      };
    
      fetchModelTrackings();
    }, [modelId]);

    const organizeDataByDepartment = (data) => {
      const departmentMap = data.reduce((acc, item) => {
        const departmentName = item.Department.Name; 
        if (!acc[departmentName]) {
          acc[departmentName] = [];
        }
        acc[departmentName].push({
          status: item.MainStatus,
          modelId: item.ModelId,
          quantityDelivered: item.QuantityDelivered || 'N/A',
          quantityReceived: item.QuantityReceived
        });
        return acc;
      }, {});
    
      setDepartments(Object.entries(departmentMap));
    };


  function getStatusIcon(status) {
      switch (status) {
          case 'AWAITING':
              return <PendingIcon color="action" />;
          case 'TODO':
              return <ApprovedIcon color="primary" />;
          case 'DONE':
              return <CompletedIcon color="success" />;
          case 'INPROGRESS':
              return <OngoingIcon color="info" />;
          default:
              return null; // or a default icon
      }
  };
    
  return (
    <Box sx={{ 
      width: 250, maxWidth: 500, margin: 'auto', padding: '15px'
       }}>

      {
        departments.length > 0 ? 
        departments.map(([departmentName, details], index) => (
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
                        {getStatusIcon(detail.status)}<Typography sx={{ ml: 1.5 }} variant="body2">{detail.status}</Typography>
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
                  </li>
                  ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))
        :
        <div className="progress-container">
          <CircularProgress />
        </div>
      }
    </Box>
  );
};

export default ShowManStages;
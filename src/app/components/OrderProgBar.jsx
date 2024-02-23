import { LinearProgress, Box, Typography } from '@mui/material';


function LinearProgressBar({ value }) {
  // Function to determine color based on value
  const getColor = (value) => {
    if (value < 34) return 'red';
    if (value >= 34 && value <= 67) return 'yellow';
    return 'green';
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: '10px',
            borderRadius: '5px',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getColor(value), 
              borderRadius: '5px',
            },
          }}
        />
      </Box>
      <Box minWidth={35} >
        <Typography style={{ marginLeft: '7px' }} variant="body2" color="textSecondary">{`${Math.round(
          value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


export default LinearProgressBar;
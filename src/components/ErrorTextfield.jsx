import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ErrorTextField({ errors }) {
  const errorArray = Array.isArray(errors) ? errors : [errors];

  return (
    <Snackbar
      open={errorArray.length > 0}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Paper
        elevation={3}
        style={{
          fontSize: '14px',
          maxHeight: '110px',
          overflowY: 'auto',
          width: '100%',
          padding: '15px',
          display: 'flex',
        }}
      >
        {errorArray.map((error, index) => (
          <div key={index} style={{ whiteSpace: 'pre-line', cursor: 'pointer', marginBottom: '5px' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: '#000000', fontSize: '15px', textAlign: 'left' }}>
              {error.success === false ? error.errors[2] : error.message || error}
            </Typography>
          </div>
        ))}
      </Paper>
    </Snackbar>
  );
}

export default ErrorTextField
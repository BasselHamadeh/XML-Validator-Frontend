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
        style={{
          fontSize: '14px',
          maxWidth: '700px',
          width: '600px',
          padding: '10px',
          marginLeft: '30px',
          maxHeight: '80px',
          marginBottom: '-20px'
        }}
      >
        {errorArray.map((error, index) => (
          <div key={index} style={{ whiteSpace: 'pre-line', cursor: 'pointer' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>
              {error.success === false ? error.errors[2] : error.message || error}
            </Typography>
          </div>
        ))}
      </Paper>
    </Snackbar>
  );
}

export default ErrorTextField;
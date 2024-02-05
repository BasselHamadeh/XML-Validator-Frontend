import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ErrorTextField({ errors}) {
  return (
    <Snackbar
      open={errors.length > 0}
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
          width: '740px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <Typography variant="h6" color="error" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
            Fehler beim Validieren des XML
          </Typography>
        </div>
        <div>
          {errors.map((error, index) => (
            <div key={index} style={{ whiteSpace: 'pre-line', marginBottom: '16px', cursor: 'pointer' }}>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold', color: '#000000', fontSize: '15px' }}>{error}</span>
              </Typography>
            </div>
          ))}
        </div>
      </Paper>
    </Snackbar>
  );
}

export default ErrorTextField
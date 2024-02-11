import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ErrorTextField({ errors }) {
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
          textDecoration: 'underline',
          fontSize: '14px',
          maxHeight: '110px',
          overflowY: 'auto',
          width: '100%',
          padding: '15px',
          display: 'flex',
        }}
      >
        {errors.map((error, index) => (
          <div key={index} style={{ whiteSpace: 'pre-line', cursor: 'pointer' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: '#000000', fontSize: '15px', textAlign: 'left' }}>
              {error}
            </Typography>
          </div>
        ))}
      </Paper>
    </Snackbar>
  );
}

export default ErrorTextField
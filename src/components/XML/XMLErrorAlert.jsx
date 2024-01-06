import React from 'react';
import Alert from '@mui/material/Alert';

function ErrorAlertXML({ message }) {
  return (
    <Alert severity="error" sx={{ width: 'fit-content', marginTop: '20px', marginLeft: '70px', marginBottom: '-20px' }}>
      {message}
    </Alert>
  );
}

export default ErrorAlertXML
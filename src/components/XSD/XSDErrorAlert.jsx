import React from 'react';
import Alert from '@mui/material/Alert';

function ErrorAlertXSD({ message }) {
  return (
    <Alert severity="error" sx={{ width: 'fit-content', marginTop: '4px', marginLeft: '20px' }}>
      {message}
    </Alert>
  );
}

export default ErrorAlertXSD
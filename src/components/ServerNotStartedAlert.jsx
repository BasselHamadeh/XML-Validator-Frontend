import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import WarningIcon from '@mui/icons-material/Warning';

const StyledAlertContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '250px',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#f8d7da',
  borderRadius: '8px',
  border: '4px solid #f5c6cb'
});

const StyledIcon = styled(WarningIcon)({
  fontSize: '48px',
  marginBottom: '16px',
  color: '#721c24'
});

const StyledAlertText = styled(Typography)({
  marginBottom: '16px',
  color: '#721c24'
});

const ServerNotStartedAlert = () => {
  return (
    <StyledAlertContainer>
      <StyledIcon />
      <StyledAlertText variant="h6" gutterBottom>
        Oops! It seems the server is not running.
      </StyledAlertText>
      <StyledAlertText variant="body1" paragraph>
        Please start the server and refresh once you're done.
      </StyledAlertText>
    </StyledAlertContainer>
  );
};

export default ServerNotStartedAlert
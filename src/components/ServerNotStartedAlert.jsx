import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import WarningIcon from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';

const StyledAlertContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '250px',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#f8d7da',
  borderRadius: '8px',
  border: '4px solid #f5c6cb',
});

const StyledIcon = styled(WarningIcon)({
  fontSize: '48px',
  marginBottom: '16px',
  color: '#721c24',
});

const StyledAlertText = styled(Typography)({
  marginBottom: '16px',
  color: '#721c24',
});

const StyledButtonContainer = styled('div')({
  marginTop: '20px',
});

const StyledRefreshButton = styled(IconButton)({
  backgroundColor: '#dc3545',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#bd2130',
  },
});

const ServerNotStartedAlert = ({ isServerStarting, onRefresh }) => {
  const handleRefreshClick = () => {
    onRefresh && onRefresh();
    window.location.reload(true);
  };

  return (
    <StyledAlertContainer>
      <StyledIcon />
      <StyledAlertText variant="h6" gutterBottom>
        Oops! Es scheint, dass der Server nicht läuft.
      </StyledAlertText>
      <StyledAlertText variant="body1" paragraph>
        Bitte starten Sie den Server und klicken Sie auf "Aktualisieren", wenn Sie fertig sind.
      </StyledAlertText>
      <StyledButtonContainer>
        <StyledRefreshButton onClick={handleRefreshClick} disabled={isServerStarting}>
          {isServerStarting ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
        </StyledRefreshButton>
      </StyledButtonContainer>
    </StyledAlertContainer>
  );
};

export default ServerNotStartedAlert
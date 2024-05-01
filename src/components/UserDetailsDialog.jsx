import React from 'react';
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserDetailsDialogContent = ({ loginDetails, selectedUser }) => {
  const totalLogins = loginDetails.filter((detail) => detail.email === selectedUser?.email).length;
  const { t } = useTranslation();

  return (
    <DialogContent
      sx={{
        overflowY: totalLogins > 6 ? 'scroll' : 'visible',
        maxHeight: '400px',
        position: 'relative'
      }}
    >
      <Box textAlign="center" mb={2}>
        <ListItem
          sx={{
            position: 'sticky',
            top: '0',
            background: 'white',
            zIndex: '1000',
            borderBottom: '3px solid #04809c'
          }}
        >
          <ListItemAvatar>
            <Avatar>{selectedUser?.email[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="h6" fontWeight="bold">
                {t('xml_validator_user_login_details_for')} {selectedUser?.username}
              </Typography>
            }
            secondary={
              <Typography variant="subtitle1">
                {totalLogins > 0 && (
                  <>{t('xml_validator_user_all_login')} {totalLogins} </>
                )}
                {totalLogins === 0 && <>{t('xml_validator_user_no_login')}</>}
              </Typography>
            }
          />
        </ListItem>
        <Divider />
      </Box>
      <List>
        {loginDetails
          .filter((detail) => detail.email === selectedUser?.email)
          .map((detail, index, array) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography>
                      {t('xml_validator_user_date')} {detail.tag}.{detail.monat}.{detail.jahr} - {t('xml_validator_user_time')} {detail.uhrzeit}
                    </Typography>
                  }
                />
              </ListItem>
              {index < array.length - 1 && <Divider />}
            </React.Fragment>
          ))}
      </List>
    </DialogContent>
  );
};

const UserDetailsDialogActions = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {t('xml_validator_user_close')}
      </Button>
    </DialogActions>
  );
};

const UserDetailsDialog = ({ loginDetails, selectedUser, onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="login-details-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <UserDetailsDialogContent
        loginDetails={loginDetails}
        selectedUser={selectedUser}
        onClose={onClose}
      />
      <UserDetailsDialogActions onClose={onClose} />
    </Dialog>
  );
};

export default UserDetailsDialog
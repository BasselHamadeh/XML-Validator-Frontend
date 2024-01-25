import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Divider,
  DialogActions,
  Button
} from '@mui/material';

const UserDetailsDialogContent = ({ loginDetails, selectedUser, onClose }) => {
  return (
    <DialogContent>
      {loginDetails
        .filter((detail) => detail.email === selectedUser?.email)
        .map((detail, index, array) => (
          <div key={index}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar>{selectedUser?.email[0]}</Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      email: <strong>{detail.email}</strong> - Uhrzeit: {detail.uhrzeit}
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`${detail.tag} / ${detail.monat} / ${detail.jahr}`}
                />
              </ListItem>
            </List>
            {index < array.length - 1 && <Divider />}
          </div>
        ))}
      {loginDetails.filter((detail) => detail.email === selectedUser?.email).length === 0 && (
        <div>Keine Login-Daten verfügbar</div>
      )}
    </DialogContent>
  );
};

const UserDetailsDialogActions = ({ onClose }) => {
  return (
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Schließen
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
      <DialogTitle id="login-details-dialog-title">
        Login Details for {selectedUser?.username}
      </DialogTitle>
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
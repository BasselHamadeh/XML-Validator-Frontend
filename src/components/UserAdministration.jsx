import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonAppBar from './ButtonAppBar';

function UserAdministration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/login')
      .then(response => response.json())
      .then(data => {
        const lastEntry = data[data.length - 1];
        if (lastEntry) {
          setCurrentUser(lastEntry);
          setUsername(lastEntry.username);
          setEmail(lastEntry.email);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Updated Profile:', { username, email, password });
    setUpdateSuccess(true);
  };

  return (
    <div>
      <ButtonAppBar />
      <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Profilverwaltung
        </Typography>
        {updateSuccess && (
          <Typography variant="body1" style={{ marginBottom: 20, color: 'green' }}>
            Profil erfolgreich aktualisiert!
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <TextField
              id="username"
              label="Neuer Benutzername"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              style={{ marginRight: 20, flex: 1, backgroundColor: 'white' }}
            />
            <TextField
              id="email"
              label="Neue E-Mail"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              style={{ flex: 1, backgroundColor: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <TextField
              id="password"
              label="Neues Passwort"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              style={{ marginRight: 20, flex: 1, backgroundColor: 'white' }}
            />
            <TextField
              id="passwordConfirmation"
              label="Passwort bestätigen"
              variant="outlined"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              style={{ flex: 1, backgroundColor: 'white' }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Speichern
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UserAdministration
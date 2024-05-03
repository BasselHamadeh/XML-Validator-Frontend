import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonAppBar from './ButtonAppBar';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

function UserAdministration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/login')
      .then(response => response.json())
      .then(data => {
        const lastEntry = data[data.length - 1];
        if (lastEntry) {
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
    setLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log('Updated Profile:', { username, email, password });
      setUpdateSuccess(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <ButtonAppBar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Profilverwaltung
        </Typography>
        {loading && <CircularProgress style={{ marginBottom: 20 }} />}
        {updateSuccess && (
          <Typography variant="body1" style={{ marginBottom: 20, color: 'green' }}>
            Profil erfolgreich aktualisiert!
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="username"
                label="Neuer Benutzername"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                label="Neue E-Mail"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="password"
                label="Neues Passwort"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="passwordConfirmation"
                label="Passwort bestätigen"
                variant="outlined"
                type="password"
                fullWidth
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Speichern...' : 'Speichern'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}

export default UserAdministration
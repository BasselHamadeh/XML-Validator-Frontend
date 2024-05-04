import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonAppBar from './ButtonAppBar';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, InputAdornment, Paper, Snackbar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function UserAdministration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
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
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    // Validierung des Passworts
    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{6,20}$/.test(newPassword);
    setPasswordError(!isValidPassword);
  };

  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Validierung der Eingaben
    if (password !== passwordConfirmation || passwordError) {
      setPasswordError(true);
      setLoading(false);
      setTimeout(() => {
        setPasswordError(false);
      }, 5000);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setUpdateSuccess(true);
        setLoading(false);
        console.log('Benutzerdaten erfolgreich aktualisiert:', data);
      } else {
        throw new Error('Fehler beim Aktualisieren der Benutzerdaten');
      }
    } catch (error) {
      console.error('Fehler:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <ButtonAppBar />
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom style={{ marginBottom: 20 }}>
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
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    label="Neuer Benutzername"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleUsernameChange}
                    InputProps={{ style: { backgroundColor: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    label="Neue E-Mail"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    InputProps={{ style: { backgroundColor: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label="Neues Passwort"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      style: { backgroundColor: 'white' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={passwordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="passwordConfirmation"
                    label="Passwort bestätigen"
                    variant="outlined"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    value={passwordConfirmation}
                    onChange={handlePasswordConfirmationChange}
                    InputProps={{
                      style: { backgroundColor: 'white' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={passwordError}
                  />
                  <Snackbar
                    open={passwordError}
                    autoHideDuration={5000}
                    message="Das Passwort entspricht nicht den Anforderungen"
                  />
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || passwordError}
                  >
                    {loading ? 'Speichern...' : 'Speichern'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default UserAdministration
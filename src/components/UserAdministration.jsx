import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonAppBar from './ButtonAppBar';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, InputAdornment, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';

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
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);

  const validateForm = useCallback(() => {
    setUsernameError(username.length === 0);
    setEmailError(!/^\S+@\S+\.\S+$/.test(email));
    setPasswordError(
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{6,20}$/.test(password) ||
        password !== passwordConfirmation
    );
  }, [username, email, password, passwordConfirmation]);

  useEffect(() => {
    document.title = 'XML Validator | Profile Management';
  }, []);

  useEffect(() => {
    validateForm();
  }, [username, email, password, passwordConfirmation, validateForm]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validateForm();
  };

  const handlePasswordConfirmationChange = (event) => {
    const confirmPassword = event.target.value;
    setPasswordConfirmation(confirmPassword);
    validateForm();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    fetchLoggedInUser();
    fetchUserId();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/login');
      const data = await response.json();
      const lastLoggedInUser = data[data.length - 1];
      if (lastLoggedInUser) {
        setUsername(lastLoggedInUser.username);
        setEmail(lastLoggedInUser.email);
      }
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };

  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:8080/user');
      const data = await response.json();
      const lastUser = data[data.length - 1];
      if (lastUser) {
        setUserId(lastUser.id);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch(`http://localhost:8080/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          newPassword: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUpdateSuccess(true);
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setErrorMessage('Fehler beim Aktualisieren des Profils');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    if (updateSuccess || errorMessage) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, errorMessage]);

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
            {updateSuccess && !errorMessage && (
              <Alert severity="success" style={{ marginBottom: 20 }}>
                Profil erfolgreich aktualisiert!
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" style={{ marginBottom: 20 }}>
                {errorMessage}
              </Alert>
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
                    error={usernameError}
                    helperText={usernameError && "Benutzername erforderlich"}
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
                    error={emailError}
                    helperText={emailError && "Ungültige E-Mail-Adresse"}
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
                    error={passwordError}
                    helperText={
                      passwordError &&
                      "Das Passwort muss zwischen 6 und 20 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein Sonderzeichen enthalten."
                    }
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
                    error={passwordError}
                    helperText={passwordError && "Passwörter stimmen nicht überein"}
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
                  />
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || passwordError || emailError || usernameError}
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
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
import { useTranslation } from 'react-i18next';

function UserAdministration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const { t } = useTranslation();

  const validateForm = useCallback(() => {
    setUsernameError(username.length === 0);

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{6,20}$/;
    const isPasswordValid = passwordPattern.test(password);
    setPasswordError(
      (password.length > 0 && !isPasswordValid) || password !== passwordConfirmation
    );
  }, [username, password, passwordConfirmation]);

  useEffect(() => {
    document.title = 'XML Validator | Profile Management';
  }, []);

  useEffect(() => {
    validateForm();
  }, [username, password, passwordConfirmation, validateForm]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
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
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateSuccess(true);
        setUsernameError(false);
        setPasswordError(false);
        setUsernameTaken(false);
        setErrorMessage('');
      } else {
        if (data.message === 'Benutzername bereits vergeben') {
          setUsernameTaken(true);
          setErrorMessage(t('xml_validator_account_username_taken'));
        } else {
          setErrorMessage(data.message);
          console.log(data.message);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setErrorMessage(t('xml_validator_account_errormessage'));
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
              {t('xml_validator_account_profile_management')}
            </Typography>
            {loading && <CircularProgress style={{ marginBottom: 20 }} />}
            {updateSuccess && !errorMessage && (
              <Alert severity="success" style={{ marginBottom: 20 }}>
                {t('xml_validator_account_profile_updated')}
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
                    label={t('xml_validator_account_new_username')}
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleUsernameChange}
                    error={usernameError || usernameTaken}
                    helperText={
                      (usernameError && t('xml_validator_account_invalid_username')) ||
                      (usernameTaken && t('xml_validator_account_username_taken'))
                    }
                    InputProps={{ style: { backgroundColor: 'white' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label={t('xml_validator_account_new_password')}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
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
                  {passwordError && (
                    <Typography variant="body2" color="error" style={{ marginTop: 4 }}>
                      {t('xml_validator_account_password_criteria')}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="passwordConfirmation"
                    label={t('xml_validator_account_password_criteria_confirm')}
                    variant="outlined"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    value={passwordConfirmation}
                    onChange={handlePasswordConfirmationChange}
                    error={passwordError}
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
                  {passwordError && (
                    <Typography variant="body2" color="error" style={{ marginTop: 4 }}>
                      {t('xml_validator_account_password_dont_match')}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || passwordError || usernameError || usernameTaken}
                  >
                    {loading ? t('xml_validator_account_Saving...') : t('xml_validator_account_Save')}
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
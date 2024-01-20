import React, { useState, useEffect } from 'react';
import ButtonAppBar from '../components/ButtonAppBar';
import Heading from '../components/UserHeading';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ServerNotStartedAlert from '../components/ServerNotStartedAlert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import EventIcon from '@mui/icons-material/Event';
import Button from '@mui/material/Button';

const StyledTableCell = ({ children, isBold, isHeader, ...other }) => {
  return (
    <TableCell
      style={{
        fontWeight: isBold ? 'bold' : 'normal',
        borderBottom: isHeader ? '2px solid #04809c' : 'none',
        backgroundColor: isHeader ? 'transparent' : 'transparent',
        color: isHeader ? 'black' : 'inherit',
      }}
      {...other}
    >
      {children}
    </TableCell>
  );
};

const StyledTableRow = ({ children, isBold, ...other }) => {
  return (
    <TableRow style={{ fontWeight: isBold ? 'bold' : 'normal' }} {...other}>
      {children}
    </TableRow>
  );
};

const UserPage = () => {
  const { t } = useTranslation();
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverNotStarted, setServerNotStarted] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/user');
        if (response.ok) {
          const users = await response.json();
          setUploadedUsers(users);
        } else {
          setServerNotStarted(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setServerNotStarted(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLoginDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/login');
        if (response.ok) {
          const details = await response.json();
          setLoginDetails(details);
        }
      } catch (error) {
        console.error('Error fetching login details:', error.message);
      }
    };

    fetchLoginDetails();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();
    setLoginTime(currentTime);
  }, []);

  const sortedUsers = [...uploadedUsers].sort((a, b) => {
    if (a.status === 'Administrator' && b.status !== 'Administrator') {
      return -1;
    } else if (a.status !== 'Administrator' && b.status === 'Administrator') {
      return 1;
    } else {
      return 0;
    }
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sicherheitsgruppe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value || '');
  };

  const handleLoginDetailsClick = (user) => {
    setSelectedUser(user);
    setLoginDetailsDialogOpen(true);
  };

  return (
    <div>
      <ButtonAppBar />
      <Heading />
      {!serverNotStarted && (
        <TextField
          variant="outlined"
          placeholder='Search User . . .'
          fullWidth
          margin="normal"
          onChange={handleSearchTermChange}
          style={{
            maxWidth: '400px',
            marginLeft: '8px',
            marginBottom: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '4px'
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#04809c' }} />
          }}
        />
      )}
      {serverNotStarted && <ServerNotStartedAlert />}
      {!serverNotStarted && filteredUsers.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '10px', marginLeft: '7px' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell isBold isHeader>ID</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_name')}</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_email')}</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_role')}</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_group')}</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_password')}</StyledTableCell>
                <StyledTableCell isBold isHeader>{t('xml_validator_view_login_details')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredUsers
              ).map((row) => (
                <StyledTableRow key={row.id} isBold={row.status === 'Administrator'}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.username}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>
                    {row.status ? row.status : <span style={{ color: 'red' }}>Keine Daten vorhanden</span>}
                  </StyledTableCell>
                  <StyledTableCell>{row.sicherheitsgruppe}</StyledTableCell>
                  <StyledTableCell>{row.password}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleLoginDetailsClick(row)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[4, 6]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* Login Details Dialog */}
      <Dialog
        open={loginDetailsDialogOpen}
        onClose={() => setLoginDetailsDialogOpen(false)}
        aria-labelledby="login-details-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="login-details-dialog-title">
          Login Details for {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {loginDetails
              .filter((detail) => detail.username === selectedUser?.username)
              .map((detail, index, array) => (
                <div key={index}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
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
                        primary={`Tag: ${detail.tag}\nMonat: ${detail.monat}\nJahr: ${detail.jahr}`}
                      />
                    </ListItem>
                  </List>
                  {index < array.length - 1 && (
                    <div style={{ borderBottom: '2px solid #04809c', margin: '10px 0' }} />
                  )}
                </div>
              ))}
            {loginDetails.filter((detail) => detail.username === selectedUser?.username).length === 0 && (
              <div>Keine Login-Daten verfügbar</div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDetailsDialogOpen(false)} color="primary">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>

      {loginTime && (
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
          {`Sitzung von: ${loginTime}`}
        </div>
      )}
    </div>
  );
};

export default UserPage
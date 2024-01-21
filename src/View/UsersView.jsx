import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import ButtonAppBar from '../components/ButtonAppBar';
import ServerNotStartedAlert from '../components/ServerNotStartedAlert';

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
      <DialogContent>
        {loginDetails
          .filter((detail) => detail.username === selectedUser?.username)
          .map((detail, index, array) => (
            <div key={index}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar>{selectedUser?.username[0]}</Avatar>
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
        {loginDetails.filter((detail) => detail.username === selectedUser?.username).length === 0 && (
          <div>Keine Login-Daten verfügbar</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UsersView = () => {
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverNotStarted, setServerNotStarted] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
                <StyledTableCell isBold isHeader>Name</StyledTableCell>
                <StyledTableCell isBold isHeader>Email</StyledTableCell>
                <StyledTableCell isBold isHeader>Role</StyledTableCell>
                <StyledTableCell isBold isHeader>Group</StyledTableCell>
                <StyledTableCell isBold isHeader>Password</StyledTableCell>
                <StyledTableCell isBold isHeader>Login Details</StyledTableCell>
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
                    <Tooltip title="Show Details" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => handleLoginDetailsClick(row)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
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

      {loginDetailsDialogOpen && (
        <UserDetailsDialog
          loginDetails={loginDetails}
          selectedUser={selectedUser}
          onClose={() => setLoginDetailsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersView
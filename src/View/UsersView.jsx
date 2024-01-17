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
import Alert from '@mui/material/Alert';

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

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'username', headerName: t('xml_validator_view_name'), width: 150 },
    { field: 'email', headerName: t('xml_validator_view_email'), width: 200 },
    { field: 'status', headerName: t('xml_validator_view_role'), width: 150 },
    { field: 'sicherheitsgruppe', headerName: t('xml_validator_view_group'), width: 150 },
    { field: 'password', headerName: t('xml_validator_view_password'), width: 200 },
  ];

  const filteredUsers = [...uploadedUsers].sort((a, b) => {
    if (a.status === 'Administrator' && b.status !== 'Administrator') return -1;
    if (a.status !== 'Administrator' && b.status === 'Administrator') return 1;
    if (a.status === 'Administrator' && b.status === 'Administrator') {
      return a.username === 'admin' ? -1 : 1;
    }
    return 0;
  }).filter((user) =>
    user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ButtonAppBar />
      <Heading />
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
      {serverNotStarted && (
        <Alert severity="error" style={{ margin: '10px', textAlign: 'center', fontSize: '20px', width: '810px', fontFamily: 'Roboto' }}>
          Oops! It seems the server is not running. Please start the server. Refresh once you're done.
        </Alert>
      )}
      {!serverNotStarted && filteredUsers.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '10px', marginLeft: '7px' }}>
          {filteredUsers.length === 0 ? null : (
            <>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <StyledTableCell
                        key={column.field}
                        isBold={column.field === 'status' || column.field === 'sicherheitsgruppe'}
                        isHeader
                      >
                        <b>{column.headerName}</b>
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredUsers
                  ).map((row) => (
                    <StyledTableRow
                      key={row.id}
                      isBold={
                        row.status === 'Administrator' || row.sicherheitsgruppe === 'Administratoren'
                      }
                    >
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.field}
                          isBold={
                            (column.field === 'status' || column.field === 'sicherheitsgruppe') &&
                            (row.status === 'Administrator' || row.sicherheitsgruppe === 'Administratoren')
                          }>
                          {row[column.field]}
                        </StyledTableCell>
                      ))}
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
            </>
          )}
        </TableContainer>
      )}
    </div>
  );
};

export default UserPage
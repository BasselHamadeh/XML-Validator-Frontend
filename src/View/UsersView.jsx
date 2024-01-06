import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ButtonAppBar from '../components/ButtonAppBar';
import Heading from '../components/UserHeading';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

const StyledTableCell = styled(TableCell)(({ theme, isBold }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2C2B2E',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '17.5px',
    border: '2px solid #04809c',
    textAlign: 'center'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16.5,
    fontWeight: isBold ? 'bold' : 'normal',
    border: '2px solid #04809c',
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ isBold }) => ({
  fontWeight: isBold ? 'bold' : 'normal',
  '& > *': {
    fontWeight: isBold ? 'bold' : 'normal',
  },
}));

const UserPage = () => {
  const { t } = useTranslation();
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/ressources/benutzerdaten.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const text = new TextDecoder().decode(result.value);

        Papa.parse(text, {
          header: true,
          complete: (result) => {
            const rowsWithId = result.data.map((row, index) => ({ id: index + 1, ...row }));
            const sortedRows = rowsWithId.sort((a, b) => {
              const aIsAdmin = a.Benutzer === 'Administrator';
              const bIsAdmin = b.Benutzer === 'Administrator';
              if (aIsAdmin && !bIsAdmin) return -1;
              if (!aIsAdmin && bIsAdmin) return 1;
              if (aIsAdmin && bIsAdmin) {
                return a.Benutzer === 'Admin' ? -1 : 1;
              }
              return 0;
            });
            setUploadedUsers(sortedRows);
          },
          error: (error) => {
            console.error('Error parsing data:', error.message);
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error.message);
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

  const handleEditClick = (userId) => {
    console.log(`Edit user with ID ${userId}`);
  };

  const handleDeleteClick = (userId) => {
    console.log(`Delete user with ID ${userId}`);
  };

  const columns = [
    { field: 'test', headerName: t('xml_validator_view_name'), width: 150 },
    { field: 'test@hotmail.de', headerName: t('xml_validator_view_email'), width: 200 },
    { field: 'Benutzer', headerName: t('xml_validator_view_role'), width: 150 },
    { field: 'Mitarbeiter', headerName: t('xml_validator_view_group'), width: 150 },
    { field: 'Bng8VUVZo9KSVQc4TYlNZSuwl8TneOjuot/ssw+B71qs=', headerName: t('xml_validator_view_password'), width: 200 },
    { field: 'verwalten', headerName: t('verwalten'), width: 150 },
  ];

  const filteredUsers = uploadedUsers.filter((user) =>
    user.test && user.test.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ButtonAppBar />
      <Heading />
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchTermChange}
        style={{ maxWidth: '400px', marginLeft: '8px', marginBottom: '60px' }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#04808c' }} />
          ),
        }}
      />
      <TableContainer component={Paper} style={{ marginTop: '10px', marginLeft: '7px' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.field}
                  isBold={column.field === 'Benutzer' || column.field === 'Mitarbeiter'}
                >
                  {column.headerName}
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
                isBold={row.Benutzer === 'Administrator' || row.Mitarbeiter === 'Administratoren'}
              >
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.field}
                    isBold={
                      (column.field === 'Benutzer' || column.field === 'Mitarbeiter') &&
                      (row.Benutzer === 'Administrator' || row.Mitarbeiter === 'Administratoren')
                    }
                  >
                    {column.field === 'verwalten' ? (
                      <div>
                        <Tooltip title="Edit" arrow>
                          <EditIcon
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            onClick={() => handleEditClick(row.id)}
                          />
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <DeleteIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteClick(row.id)}
                          />
                        </Tooltip>
                      </div>
                    ) : (
                      row[column.field]
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default UserPage
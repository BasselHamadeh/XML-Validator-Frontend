import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { TableCell } from '@mui/material';

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

const UserTable = ({ filteredUsers, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, handleLoginDetailsClick }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: '10px', marginLeft: '7px' }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell isBold isHeader>ID</StyledTableCell>
            <StyledTableCell isBold isHeader>Name</StyledTableCell>
            <StyledTableCell isBold isHeader>Email</StyledTableCell>
            <StyledTableCell isBold isHeader>Role</StyledTableCell>
            <StyledTableCell isBold isHeader>Team</StyledTableCell>
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
        rowsPerPageOptions={[4, 6, 8, 10]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default UserTable
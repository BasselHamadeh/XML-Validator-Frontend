import React, { useState, useEffect } from 'react';
import ButtonAppBar from '../components/ButtonAppBar';
import ServerNotStartedAlert from '../components/ServerNotStartedAlert';
import UserHeading from '../components/Heading/UserHeading';
import SearchBar from '../components/SearchBar';
import UserTable from '../components/UserTable';
import UserDetailsDialog from '../components/UserDetailsDialog';

const UsersView = () => {
  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
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
          console.log('Received user data from server:', users);
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
    if (a.username.toLowerCase() === 'admin' && b.username.toLowerCase() !== 'admin') {
      return -1;
    } else if (a.username.toLowerCase() !== 'admin' && b.username.toLowerCase() === 'admin') {
      return 1;
    } else {
      return 0;
    }
  });

  const handleLoginDetailsClick = (user) => {
    setSelectedUser(user);
    setLoginDetailsDialogOpen(true);
  };

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

  return (
    <div>
      <ButtonAppBar />
      <UserHeading />
      {!serverNotStarted && <SearchBar handleSearchTermChange={handleSearchTermChange} />}
      {serverNotStarted && <ServerNotStartedAlert />}
      {!serverNotStarted && filteredUsers.length > 0 && (
        <UserTable
          filteredUsers={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleLoginDetailsClick={handleLoginDetailsClick}
        />
      )}

      {loginDetailsDialogOpen && (
        <UserDetailsDialog
          loginDetails={loginDetails.filter((detail) => detail.email === selectedUser?.email)}
          selectedUser={selectedUser}
          onClose={() => setLoginDetailsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersView;
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
  const [searchCategory, setSearchCategory] = useState('username');
  const [serverNotStarted, setServerNotStarted] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [loginDetailsDialogOpen, setLoginDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastLoggedInUser, setLastLoggedInUser] = useState(null);

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

    document.title = 'XML Validator | Users';

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLoginDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/login');
        if (response.ok) {
          const details = await response.json();
          setLoginDetails(details);

          // Set the last logged-in user based on the response
          if (details.length > 0) {
            const lastLogin = details.reduce((prev, current) =>
              new Date(current.jahr, current.monat - 1, current.tag, ...current.uhrzeit.split(':')) >
              new Date(prev.jahr, prev.monat - 1, prev.tag, ...prev.uhrzeit.split(':'))
                ? current
                : prev
            );
            setLastLoggedInUser(lastLogin);
          }
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

  const handleSearchChange = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  const filteredUsers = sortedUsers.filter((user) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const lowerCaseUsername = user.username.toLowerCase();
    const lowerCaseEmail = user.email.toLowerCase();
    const lowerCaseStatus = user.status.toLowerCase();
    const lowerCaseGroup = user.sicherheitsgruppe.toLowerCase();

    switch (searchCategory) {
      case 'username':
        return lowerCaseUsername.includes(lowerCaseTerm);
      case 'email':
        return lowerCaseEmail.includes(lowerCaseTerm);
      default:
        return (
          lowerCaseUsername.includes(lowerCaseTerm) ||
          lowerCaseEmail.includes(lowerCaseTerm) ||
          lowerCaseStatus.includes(lowerCaseTerm) ||
          lowerCaseGroup.includes(lowerCaseTerm)
        );
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <ButtonAppBar />
      <UserHeading />
      {!serverNotStarted && <SearchBar handleSearchChange={handleSearchChange} />}
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

      {!serverNotStarted && lastLoggedInUser && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3 style={{ textDecoration: 'underline' }}>Aktuell eingeloggter Benutzer:</h3>
          <p style={{ color: '#04809c', fontWeight: 'bold', fontSize: '20px' }}>{lastLoggedInUser.username}</p>
        </div>
      )}
    </div>
  );
};

export default UsersView
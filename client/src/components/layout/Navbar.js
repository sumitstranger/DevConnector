import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const authLink = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='!#'>
          <i className='fas fa-sign-out'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLink = (
    <ul>
      <li>
        <a href='!#'>Developers</a>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLink : guestLink}</Fragment>
      )}
    </nav>
  );
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProp, { logout })(Navbar);

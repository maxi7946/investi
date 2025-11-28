import React from 'react';
import { Link } from 'react-router-dom';

/**
 * UserAuth component that displays the sign-in and register buttons in the header
 */
const UserAuth = () => {
  return (
    <div className="col-md-3 col-lg-3">
      <ul className="unstyled user">
        <li className="sign-in">
          <Link to="/login" className="btn btn-primary">
            <i className="fa fa-user"></i> sign in
          </Link>
        </li>
        <li className="sign-up">
          <Link to="/signup" className="btn btn-primary">
            <i className="fa fa-user-plus"></i> register
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserAuth;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBlackTie, FaGraduationCap } from 'react-icons/fa';

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <FaUserCircle /> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-light">
        <FaBlackTie /> Add Experience
      </Link>
      <Link to="/add-education" className="btn btn-light">
        <FaGraduationCap /> Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;

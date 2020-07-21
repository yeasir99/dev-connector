import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //pull out data

  const { email, password } = formData;

  //update data

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //submit form

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <FaUser /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);

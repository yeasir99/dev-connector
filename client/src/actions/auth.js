import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import * as ACTIONS from "./types";

// Load user

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: ACTIONS.USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.AUTH_ERROR,
    });
  }
};

// register user

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: ACTIONS.REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ACTIONS.REGISTER_FAIL,
    });
  }
};

// Login user

export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: ACTIONS.LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: ACTIONS.LOGIN_FAIL,
    });
  }
};

// Logout and Clear profile

export const logout = () => dispatch => {
  dispatch({
    type: ACTIONS.CLEAR_PROFILE,
  });
  dispatch({
    type: ACTIONS.LOGOUT,
  });
};

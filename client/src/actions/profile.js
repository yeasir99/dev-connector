import axios from "axios";
import { setAlert } from "./alert";
import * as ACTIONS from "./types";

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: ACTIONS.GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

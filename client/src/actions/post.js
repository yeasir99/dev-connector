import * as ACTIONS from './types';
import axios from 'axios';
import { setAlert } from './alert';

// Get Posts

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: ACTIONS.GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

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

// Add Like

export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: ACTIONS.UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove Like

export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: ACTIONS.UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: ACTIONS.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete post

export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: ACTIONS.DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: ACTIONS.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add a post

export const addPost = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ACTIONS.ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: ACTIONS.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

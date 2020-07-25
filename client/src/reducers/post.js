import * as ACTIONS from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case ACTIONS.POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

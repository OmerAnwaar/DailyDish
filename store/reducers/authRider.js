import { AUTHENTICATE_RIDER, LOGOUT_RIDER } from "../actions/auth";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_RIDER:
      return {
        token: action.token,
        userId: action.userId,
      };

    case LOGOUT_RIDER:
      return initialState;
    default:
      return state;
  }
};

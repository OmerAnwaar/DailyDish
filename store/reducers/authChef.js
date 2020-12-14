import { AUTHENTICATE_CHEF, LOGOUT_CHEF } from "../actions/authChef";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_CHEF:
      return {
        token: action.token,
        userId: action.userId,
      };

    case LOGOUT_CHEF:
      return initialState;
    default:
      return state;
  }
};

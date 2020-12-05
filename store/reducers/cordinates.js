import { ADD_CORDINATES } from "../actions/cordinates";

const initialState = {
  latitude: null,
  longitude: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_CORDINATES:
      return {
        latitude: action.addData.latitude,
        longitude: action.addData.longitude,
      };

    default:
      return state;
  }
};

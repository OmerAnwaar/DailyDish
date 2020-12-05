export const ADD_CORDINATES = "ADD_ADDRESS";


export const addCords = (latitude, longitude) => {
  return {
    type: ADD_CORDINATES,
    addData: {
      latitude: latitude,
      longitude: longitude,
    },
  };
};

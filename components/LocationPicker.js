import React, { useState, useEffect, useReducer, useCallback } from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import MapView from "react-native-maps";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions/cordinates";
import Input from "../components/UI/Input";
import Addresses from './UI/Addresses'

import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import Colors from "../constants/Colors";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

// import MapPreview from "./MapPreview";
const INITIAL_ADDRESS =
  "Badshahi Mosque, Walled City of Lahore, Lahore, Punjab, Pakistan";
const initialLocation = {
  latitude: 31.588,
  longitude: 74.3107,
  latitudeDelta: 0.0025,
  longitudeDelta: 0.0015,
};
const db = firebase.firestore();

const LocationPicker = (props) => {
  const [currentUser, setcurrentUser] = useState();
  const [loading, setloading] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(initialLocation);
  const [error, seterror] = useState({ error: "" });
  const [address, setaddress] = useState("");
  const [displayAdd, setdisplayAdd] = useState(false);
  const [showAddress, setshowAddress] = useState(false);
  const [fetching, setfetching] = useState(false);
  const [ModalView, setModalView] = useState(false);
  const [inputerror, setError] = useState(null);
  const [manualSetter, setmanualSetter] = useState(false);
  const dispatch = useDispatch();
  const ReduxLongitude = useSelector((state) => state.cord.longitude);
  const ReduxLatitude = useSelector((state) => state.cord.latitude);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [SavedAddress, setSavedAddress] = useState([]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      houseNumber: "",
      street: "",
      block: "",
      area: "",
    },
    inputValidities: {
      houseNumber: false,
      street: false,
      block: false,
      area: false,
    },
    formIsValid: false,
  });
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  useEffect(() => {
    if (inputerror) {
      Alert.alert("Please enter a valid Address", inputerror, [
        { text: "Okay" },
      ]);
    }
  }, [error]);
  useEffect(() => {
   getSavedAddress()
  }, [SavedAddress])

  const CordinateSaver = async () => {
    console.log("user id ====>", ReduxCurrentUser);
    await db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .update({
        location: new firebase.firestore.GeoPoint(
          Number.parseFloat(pickedLocation.latitude.toFixed(4)),
          Number.parseFloat(pickedLocation.longitude.toFixed(4))
        ),
      });
  };
  const ManualAddressSaver = async () => {
    setloading(true);
    let houseNo = formState.inputValues.houseNumber;
    let stNo = formState.inputValues.street;
    let blk = formState.inputValues.block;
    let areaSet = formState.inputValues.area;
    let concatAddress =
      "House" +
      " " +
      houseNo +
      " " +
      "street number" +
      " " +
      stNo +
      " " +
      "Block" +
      " " +
      blk +
      " " +
      areaSet +
      ",Lahore,Punjab,Pakistan";
    console.log(concatAddress);
    await db.collection("app-users").doc(ReduxCurrentUser).update({
      CurrentAddress: concatAddress,
    });
    await db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .update({
        SavedAddress: firebase.firestore.FieldValue.arrayUnion(concatAddress),
      });
    setloading(false);
    setmanualSetter(true);
   
  };
  const saveAddToDb = async () => {
    await db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .update({
        SavedAddress: firebase.firestore.FieldValue.arrayUnion(address),
      });
    setloading(false);
  
  };
  // const verifyPermissions = async () => {
  //   const result = await Permissions.askAsync(Permissions.LOCATION);
  //   if (result.status !== "granted") {
  //     Alert.alert(
  //       "Insufficient permissions!",
  //       "You need to grant location permissions to use this app.",
  //       [{ text: "Okay" }]
  //     );
  //     return false;
  //   }
  //   return true;
  // };

  Geocoder.init("AIzaSyBCSNe6FSjhJtL8iENJ8bk25HjCd0ApAWc");
  const _getlocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("PERMSSION NOT GRANTED");
      seterror({ error: "Location Permission not Granted" });
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: error }]
      );
      return false;
    }
    const location = await Location.getCurrentPositionAsync();

    setPickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.00019,
      longitudeDelta: 0.0019,
    });
    dispatch(
      actions.addCords(
        pickedLocation.latitude.toFixed(4),
        pickedLocation.longitude.toFixed(4)
      )
    );
    console.log(pickedLocation);

    return true;
  };
  const getAdd = () => {
    Geocoder.from({
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
    })
      .then((json) => {
        var addressComponent = json.results[0];
        // console.log(addressComponent);
        setaddress(addressComponent.formatted_address);
        setfetching(false);
      })
      .catch((error) => console.warn(error));
  };

  // const getLocationHandler = async () => {
  //   const hasPermission = await verifyPermissions();
  //   if (!hasPermission) {
  //     return;
  //   }

  //   try {
  //     setIsFetching(true);
  //     const location = await Location.getCurrentPositionAsync({
  //       timeout: 5000,
  //     });
  //     console.log(location);
  //     setPickedLocation({
  //       lat: location.coords.latitude,
  //       lng: location.coords.longitude,
  //     });
  //   } catch (err) {
  //     Alert.alert(
  //       "Could not fetch location!",
  //       "Please try again later or pick a location on the map.",
  //       [{ text: "Okay" }]
  //     );
  //   }
  //   setIsFetching(false);
  // };
  const getAddressHandler = async () => {
    setloading(true);
    const getCord = await _getlocation();
    const getadd = getAdd();
    // dispatch(
    //   actions.addCords(
    //     pickedLocation.latitude.toFixed(4),
    //     pickedLocation.longitude.toFixed(4)
    //   )
    // );

    setloading(false);
    setshowAddress(true);
  };
  const genAddress = async () => {
    setloading(true);
    setfetching(true);
    const getadd = await getAdd();
    const savingCords = CordinateSaver();
    setloading(false);
    setshowAddress(true);
    setdisplayAdd(true);
  };
  const addSave = async () => {
    setloading(true);
    saveAddToDb();
  };
  const getSavedAddress = async () => {
    await db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("Document recieved", doc.data().SavedAddress);
          setSavedAddress(doc.data().SavedAddress);
        } else {
          console.log("no such doc bro");
        }
      })
      .catch((error) => {
        console.log("error agya!!!!!!!");
        seterr(error);
      });
  };

  return (
    <View style={styles.locationPicker}>
      <View>
        <MapView
          style={styles.map}
          loadingEnabled={true}
          provider={MapView.PROVIDER_GOOGLE}
          region={pickedLocation}
          showsUserLocation={true}
          maxZoomLevel={65}
        ></MapView>
        <View style={styles.btnView}>
          <Button
            title="Locate Me on Map"
            onPress={getAddressHandler}
            color={Colors.primary}
            style={styles.button}
          ></Button>
        </View>

        {loading === true ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <View>
            {showAddress == true ? (
              <View style={styles.cordContainer}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    padding: 5,
                    color: "#f1f2f6",
                  }}
                >
                  We Got Your Exact Location! 🎯
                </Text>
                <Text style={styles.textClr}>Latitude is {ReduxLatitude} </Text>
                <Text style={styles.textClr}>
                  Longitude is {ReduxLongitude}
                </Text>
              </View>
            ) : (
              <View style={styles.NotSetcordContainer}>
                <Text style={{ fontSize: 15, color: "#f1f2f6" }}>
                  Locate to See Something Awesome!{" "}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.btnView}>
          <Button
            title="Generate Address!"
            color={Colors.primary}
            onPress={genAddress}
            style={styles.button}
          ></Button>
        </View>
        {displayAdd === true ? (
          <View>
            {address === INITIAL_ADDRESS ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <View>
                <View style={styles.addressContainer}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      padding: 5,
                      color: "#f1f2f6",
                    }}
                  >
                    Auto Located Address: 🏘️
                  </Text>

                  <Text style={styles.textClr}> {address}</Text>
                </View>
                <Button
                  title="Save Address?"
                  color={Colors.primary}
                  onPress={addSave}
                  style={styles.button}
                  disabled={loading}
                ></Button>

                <Modal
                  animationType={"slide"}
                  transparent={true}
                  visible={ModalView}
                  onRequestClose={() => {
                    console.log("Modal has been closed.");
                  }}
                >
                  {/*All views of Modal*/}

                  <View style={styles.modal}>
                    <View style={styles.inputHanler}>
                      <Input
                        id="houseNumber"
                        label="House Number:"
                        // placeholder="password"
                        keyboardType="numeric"
                        required
                        minLength={1}
                        autoCapitalize="none"
                        errorText="Please enter a Valid Address."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                      />
                      <Input
                        id="street"
                        label="Street Number:"
                        // placeholder="password"
                        keyboardType="numeric"
                        required
                        minLength={1}
                        autoCapitalize="none"
                        errorText="Please enter a Valid Address."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                      />
                      <Input
                        id="block"
                        label="Block:"
                        // placeholder="password"
                        keyboardType="default"
                        required
                        minLength={1}
                        maxLength={5}
                        autoCapitalize="none"
                        errorText="Please enter a Valid Address."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                      />
                      <Input
                        id="area"
                        label="Area:"
                        // placeholder="password"
                        keyboardType="default"
                        required
                        minLength={5}
                        autoCapitalize="none"
                        errorText="Please enter a Valid Address."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                      />
                    </View>
                    <View>
                      {manualSetter == true ? (
                        <Text style={{ color: "green" , padding: 10, fontSize: 20}}> Saved and Set to Current Address!</Text>
                      ) : (
                        <></>
                      )}
                    </View>
                    <View style={styles.modalCloseBtn}>
                      <Button
                        disabled={loading}
                        style={styles.button}
                        color={Colors.primary}
                        title=" Save Address"
                        onPress={ManualAddressSaver}
                      />

                      <Button
                        style={styles.button}
                        color={Colors.primary}
                        title=" < Go Back"
                        onPress={() => {
                          setModalView(false);
                        }}
                      />
                    </View>
                  </View>
                </Modal>
                {/*Button will change state to true and view will re-render*/}
                <Button
                  style={styles.button}
                  color={Colors.primary}
                  title="Not Your Address? 😢 "
                  onPress={() => {
                    setModalView(true);
                  }}
                />
              </View>
            )}
            {/* <Text>Your address: {address}</Text> */}
          </View>
        ) : (
          <></>
        )}
      </View>
     
      <Addresses addresses={SavedAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 20,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  map: {
    height: 225,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    color: Colors.primary,
    padding: 5,
    height: 20,
  },
  addressContainer: {
    alignItems: "center",
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 4,
    height: 100,
    justifyContent: "center",
    textAlign: "center",
  },
  cordContainer: {
    alignItems: "center",
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 10,
    justifyContent: "center",
    textAlign: "center",
    height: 100,
  },
  textClr: {
    color: "#f1f2f6",
    fontSize: 15,
  },
  NotSetcordContainer: {
    alignItems: "center",
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 10,
    justifyContent: "center",
    textAlign: "center",
    height: 50,
  },
  btnView: {
    width: "50%",
    marginLeft: 100,
    padding: 8,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dfe6e9",
    opacity: 2,
    height: 600,
    width: "85%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 100,
    marginLeft: 35,
  },
  text: {
    color: "#3f2949",
    marginTop: 10,
  },
  modalCloseBtn: {
    top: 70,
  },
  inputHanler: {
    width: "90%",
    height: 300,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default LocationPicker;

import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import MapView from "react-native-maps";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions/cordinates";

import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Colors from "../constants/Colors";
import { add } from "react-native-reanimated";
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
  const dispatch = useDispatch();
  const ReduxLongitude = useSelector((state) => state.cord.longitude);
  const ReduxLatitude = useSelector((state) => state.cord.latitude);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const CordinateSaver = async () => {
    console.log("user id ====>", ReduxCurrentUser);
    // var thisis =  Number.parseFloat(pickedLocation.latitude.toFixed(4))
    // console.log(typeof thisis)
    // console.log(thisis)
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
  const saveAddToDb = async () => {
    await db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .update({
        address: firebase.firestore.FieldValue.arrayUnion(address),
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
                  Address Not Set ❌{" "}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.btnView}>
          <Button
            title="Set My address"
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
              </View>
            )}
            {/* <Text>Your address: {address}</Text> */}
          </View>
        ) : (
          <View></View>
        )}
      </View>
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
});

export default LocationPicker;

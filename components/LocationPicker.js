import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from "react-native-geocoding";
import MapView from "react-native-maps";

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

const LocationPicker = (props) => {
  const [loading, setloading] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(initialLocation);
  const [error, seterror] = useState({ error: "" });
  const [address, setaddress] = useState("");
  const [displayAdd, setdisplayAdd] = useState(false);
  const [showAddress, setshowAddress] = useState(false);
  const [fetching, setfetching] = useState(false);

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
    setloading(false);
    setshowAddress(true);
  };
  const genAddress = async () => {
    setloading(true);
    setfetching(true);
    const getadd = await getAdd();

    setloading(false);
    setshowAddress(true);
    setdisplayAdd(true);
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

        <Button
          title="Locate Me on Map"
          onPress={getAddressHandler}
          color={Colors.primary}
          style={styles.button}
        ></Button>

        {loading === true ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <View>
            {showAddress == true ? (
              <View style={styles.cordContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 18, padding: 5, color:'#f1f2f6' }}>
                  We Got Your Exact Location! 🎯
                </Text>
                <Text style={styles.textClr}>Longitude is {pickedLocation.longitude.toString().slice(0,7)} </Text>
                <Text style={styles.textClr}>Loatitude is {pickedLocation.latitude.toString().slice(0,7)}</Text>
              </View>
            ) : (
              <View style={styles.NotSetcordContainer}>
                <Text style={{fontSize:15, color: "#f1f2f6"}}>Address Not Set ❌ </Text>
              </View>
            )}
          </View>
        )}
        <Button
          title="Set My address"
          color={Colors.primary}
          onPress={genAddress}
          style={styles.button}
        ></Button>
        {displayAdd === true ? (
          <View>
            {address === INITIAL_ADDRESS ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <View style={styles.addressContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 18, padding: 5 , color:'#f1f2f6' }}>
                  Auto Located Address: 🏘️
                </Text>
              
                <Text style={styles.textClr}> {address}</Text>
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
  },
  addressContainer: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 10,
    height: 100,
    justifyContent: 'center',
    textAlign: 'center'
  },
  cordContainer:{
    alignItems: 'center',
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 10,
    justifyContent: 'center',
    textAlign: 'center',
    height: 100,
  },
  textClr:{
    color: '#f1f2f6',
    fontSize: 15
  },
  NotSetcordContainer:{
    alignItems: 'center',
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    margin: 10,
    justifyContent: 'center',
    textAlign: 'center',
    height: 50,
  }
});

export default LocationPicker;

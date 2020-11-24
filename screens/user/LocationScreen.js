import { stopGeofencingAsync } from "expo-location";
import React from "react";
import { StyleSheet, View } from "react-native";

import LocationPicker from "../../components/LocationPicker";

const LocationScreen = () => {
  return (
    <View>
      <LocationPicker />
    </View>
  );
};

const style = StyleSheet.create({});

export default LocationScreen;

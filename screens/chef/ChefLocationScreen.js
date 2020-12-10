import { stopGeofencingAsync } from "expo-location";
import React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
// import {Constants} from 'expo'
import Constants from 'expo-constants';
import LocationPicker from "../../components/LocationPicker";
import Addresses from '../../components/UI/Addresses'

const LocationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LocationPicker />
      </ScrollView>
      
    </SafeAreaView>
  );
};

LocationScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Address",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  scrollView: {
    
    marginHorizontal: 5,
  },
});

export default LocationScreen;

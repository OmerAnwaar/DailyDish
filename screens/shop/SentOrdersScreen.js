import React from "react";
import { StyleSheet, View, Text } from "react-native";
// import { HeaderButtons, Item } from "react-navigation-header-buttons";
// import HeaderButton from "../../components/UI/HeaderButton";
// import ProductItem from "../../components/shop/ProductItem";
// import {Constants} from 'expo'
// import Constants from 'expo-constants';
// import LocationPicker from "../../components/LocationPicker";

const SentOrders = () => {
  return (
    // <SafeAreaView style={styles.container}>
    //   <ScrollView style={styles.scrollView}>
    //     <LocationPicker />
    //   </ScrollView>
    // </SafeAreaView>
    <View>
      <Text style={styles.screen}>hello Sent SentOrders!</Text>
    </View>
  );
};

// LocationScreen.navigationOptions = (navData) => {
//   return {
//     headerTitle: "Address",
//     headerLeft: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Menu"
//           iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
//           onPress={() => {
//             navData.navigation.toggleDrawer();
//           }}
//         />
//       </HeaderButtons>
//     ),
//   };
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textt: {
    textAlign: "center",
  },
});

export default SentOrders;

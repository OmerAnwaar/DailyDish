import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

const ReceievedOrdersScreen = () => {
  return (
    <View>
      <Text style={styles.screen}>hello Received Orders!</Text>
    </View>
  );
};

ReceievedOrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Received Orders",
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
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textt: {
    textAlign: "center",
  },
});

export default ReceievedOrdersScreen;

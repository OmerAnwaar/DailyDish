import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

const VoucherScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>hello</Text>
    </View>
  );
};

VoucherScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Categories",
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
    justifyContent: "center",
    alignContent: "center",
  },
});

export default VoucherScreen;

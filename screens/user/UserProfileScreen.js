import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ListItemSeparator from "../../components/UI/ListItemSeparator";
import Colors from "../../constants/Colors";

const UserProfileScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.info}>CONTACT INFORMATION</Text>
      <Text style={styles.data}>User Name {props.userName} </Text>
      <ListItemSeparator />
      <Text style={styles.data}>Address</Text>
      <ListItemSeparator />
      <Text style={styles.data}>Email Address </Text>
      <ListItemSeparator />
      <Text style={styles.data}>Mobile Number </Text>
      <ListItemSeparator />
      <Text style={styles.data}>joined on </Text>
      <ListItemSeparator />
    </View>
  );
};

UserProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Profile",
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
    // alignItems: "center",
  },
  info: {
    backgroundColor: Colors.primary,
    textAlign: "center",
    padding: 15,
    fontSize: 20,
  },
  data: {
    padding: 15,
    fontSize: 20,
    justifyContent: "space-around",
  },
});

export default UserProfileScreen;

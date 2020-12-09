import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ListItemSeparator from "../../components/UI/ListItemSeparator";
import Colors from "../../constants/Colors";
import { db } from "../../firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { isLoading } from "expo-font";

const UserProfileScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(false);
  const [Profile, setProfile] = useState({});
  useEffect(() => {
    setLoading(true);
    getProfile();
    return () => {
      getProfile();
    };
  }, []);
  const getProfile = async () => {
    setLoading(true);
    db.collection("app-users")
      .doc(ReduxCurrentUser)
      .onSnapshot((snap) => {
        setProfile({
          name: snap.data().UserName,
          address: snap.data().CurrentAddress,
          email: snap.data().UserEmail,
          phnumber: snap.data().phnumber,
          timestamp: snap.data().timestamp,
        });
        setLoading(false);
      });

    console.log("here=====>", Profile);
  };
  return (
    <View style={styles.screen}>
      {loading === true ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <View>
          <Text style={styles.info}>YOUR PROFILE</Text>
          <Text style={styles.data}>Name: {Profile.name}</Text>
          <ListItemSeparator />
          <Text style={styles.data}>Address: {Profile.address}</Text>
          <ListItemSeparator />
          <Text style={styles.data}>Email Address: {Profile.email} </Text>
          <ListItemSeparator />
          <Text style={styles.data}>Mobile Number: {Profile.phnumber}</Text>
          <ListItemSeparator />
          <ListItemSeparator />
        </View>
      )}
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

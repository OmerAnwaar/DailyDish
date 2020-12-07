import React from "react";
import { StyleSheet, View, Text } from "react-native";

const UserProfileScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.textt}>hello USER!</Text>
    </View>
  );
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

export default UserProfileScreen;

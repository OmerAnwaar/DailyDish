import React from "react";
import { StyleSheet, View, Text } from "react-native";

const ChefProfileScreen = () => {
  return (
    <View>
      <Text style={styles.screen}>hello CHEF!</Text>
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

export default ChefProfileScreen;

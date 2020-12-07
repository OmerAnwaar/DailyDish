import React from "react";
import { StyleSheet, View, Text } from "react-native";

const ReceievedOrders = () => {
  return (
    <View>
      <Text style={styles.screen}>hello Received Orders!</Text>
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

export default ReceievedOrders;

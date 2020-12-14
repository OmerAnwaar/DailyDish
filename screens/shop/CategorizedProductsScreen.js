import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CategorizedProductsScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.hello}>
        {" "}
        Hello All Categorised products from Omer!!!{" "}
      </Text>
      <Text style={styles.saad}> Have fun working here, SAAD. Good Luck!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hello: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  saad: {
    textAlign: "center",
    paddingTop: 300,
  },
});

export default CategorizedProductsScreen;

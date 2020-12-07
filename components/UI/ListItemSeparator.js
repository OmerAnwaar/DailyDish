import React from "react";
import { StyleSheet, View } from "react-native";

import colors from "../../constants/Colors";

function ListItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
  },
});

export default ListItemSeparator;

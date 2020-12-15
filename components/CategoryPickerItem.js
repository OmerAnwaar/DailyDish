import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import Icon from "../components/Icon";

function CategoryPickerItem({ item, onPress, props }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CategorizedProducts");
          console.log("category pe gya ya nai?", onPress);
        }}
      >
        <Icon
          backgroundColor={item.backgroundColor}
          name={item.icon}
          size={80}
        />
      </TouchableOpacity>
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
    width: "33%",
  },
  label: {
    marginTop: 5,
    textAlign: "center",
  },
});

export default CategoryPickerItem;

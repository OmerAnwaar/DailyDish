import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PickerItem from "../components/PickerItem";

const Picker = ({
  icon,
  items,
  numberOfColumns = 1,
  PickerItemComponent = PickerItem,
  width = "100%",
}) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.value.toString()}
      numColumns={numberOfColumns}
      renderItem={({ item }) => (
        <PickerItemComponent
          item={item}
          label={item.label}
          onPress={() => {}}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ccc",
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: "#ccc",
    flex: 1,
  },
  text: {
    flex: 1,
  },
});

export default Picker;

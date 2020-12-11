import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Picker from "../../components/picker";
import CategoryPickerItem from "../../components/CategoryPickerItem";

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "pizza",
    label: "Fast Food",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "food-fork-drink",
    label: "Desi",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "bowl",
    label: "Chinese",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "fish",
    label: "Sea Food",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "food-variant",
    label: "Continental",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "food",
    label: "Turkish",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "baguette",
    label: "Cakes and Bakery",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "cake-variant",
    label: "Desserts",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 9,
  },
];

const CategoriesScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Picker
        items={categories}
        name="category"
        numberOfColumns={3}
        PickerItemComponent={CategoryPickerItem}
        placeholder="Category"
        width="50%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {},
});

export default CategoriesScreen;

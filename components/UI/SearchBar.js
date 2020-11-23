import React from "react";
import { TextInput, View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = (props) => {
  return (
    <View style={styles.searchBox}>
      <TextInput
        placeholder="Search here"
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        style={{ flex: 1, padding: 0 }}
      />
      <Ionicons
        name={Platform.OS === "android" ? "md-search" : "ios-search"}
        size={20}
        color="#ccc"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    // position: "absolute",
    marginTop: Platform.OS === "ios" ? 10 : 5,
    marginBottom: Platform.OS === "ios" ? 5 : 2.5,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    paddingVertical: 5,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default SearchBar;

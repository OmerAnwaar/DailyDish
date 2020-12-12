import React, { useState, useContext, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  Button,
  FlatList,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PickerItem from "../categories/PickerItem";
import theContext from "./theContext";


const AppPicker = ({ items, placeholder }) => {
  // const AppPicker = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setselectedItem] = useState("not-choosen");
  const {CatProvide, setCatProvide} = useContext(theContext)


  return (
    //<CategoryContext.Provider value={labelContext}>
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          {selectedItem ? (
            <Text style={styles.text}>{selectedItem}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}

          <MaterialCommunityIcons name="chevron-down" size={20} color="black" />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.screen}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <PickerItem
                item={item}
                label={item.label}
                onPress={() => {
                  setselectedItem(item.label);
                  setCatProvide(item.label)
                  setModalVisible(false);
                }}
              />
            )}
          />
        </View>
      </Modal>
      {console.log("ye hai category====>", selectedItem)}
    </>
    // </CategoryContext.Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
  },
  container: {
    // backgroundColor: Colors.primary,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#ccc",
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: "black",
    fontFamily: "open-sans-bold",
    flex: 1,
  },
  text: {
    flex: 1,
  },
});

export default AppPicker;

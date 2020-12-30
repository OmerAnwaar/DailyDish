import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";

import Picker from "../../components/picker";
import CategoryPickerItem from "../../components/CategoryPickerItem";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CategoriesScreen = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <>
      <View style={styles.screen}>
        <View style={styles.line1}>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Fast Food",
              });
            }}
          >
            <View style={styles.button1}>
              <MaterialCommunityIcons name={"pizza"} color="white" size={40} />
              <Text style={styles.text}>Fast Food</Text>
            </View>
          </TouchableCmp>

          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Desi",
              });
            }}
          >
            <View style={styles.button2}>
              <MaterialCommunityIcons
                name={"food-fork-drink"}
                color="white"
                size={40}
              />
              <Text style={styles.text}>Desi</Text>
            </View>
          </TouchableCmp>

          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Chinese",
              });
            }}
          >
            <View style={styles.button3}>
              <MaterialCommunityIcons name={"bowl"} color="white" size={40} />
              <Text style={styles.text}>Chinese</Text>
            </View>
          </TouchableCmp>
        </View>

        <View style={styles.line2}>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Sea food",
              });
            }}
          >
            <View style={styles.button4}>
              <MaterialCommunityIcons name={"fish"} color="white" size={40} />
              <Text style={styles.text}>Sea Food</Text>
            </View>
          </TouchableCmp>

          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Continental",
              });
            }}
          >
            <View style={styles.button5}>
              <MaterialCommunityIcons
                name={"food-variant"}
                color="white"
                size={40}
              />
              <Text style={styles.text}>Continental</Text>
            </View>
          </TouchableCmp>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Turkish",
              });
            }}
          >
            <View style={styles.button6}>
              <MaterialCommunityIcons name={"food"} color="white" size={40} />
              <Text style={styles.text}>Turkish</Text>
            </View>
          </TouchableCmp>
        </View>

        <View style={styles.line3}>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Cakes and Bakery",
              });
            }}
          >
            <View style={styles.button7}>
              <MaterialCommunityIcons
                name={"baguette"}
                color="white"
                size={40}
              />
              <Text style={styles.text}>Cakes and Bakery</Text>
            </View>
          </TouchableCmp>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Desserts",
              });
            }}
          >
            <View style={styles.button8}>
              <MaterialCommunityIcons
                name={"cake-variant"}
                color="white"
                size={40}
              />
              <Text style={styles.text}>Desserts</Text>
            </View>
          </TouchableCmp>

          <TouchableCmp
            onPress={() => {
              props.navigation.navigate("CatDisplay", {
                category: "Other",
              });
            }}
          >
            <View style={styles.button9}>
              <MaterialCommunityIcons
                name={"application"}
                color="white"
                size={40}
              />
              <Text style={styles.text}>Others</Text>
            </View>
          </TouchableCmp>
        </View>
      </View>
    </>
  );
};

CategoriesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Categories",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line1: {
    marginVertical: 20,
    flexDirection: "row",
  },
  line2: {
    marginVertical: 17,
    flexDirection: "row",
  },
  line3: {
    marginVertical: 17,
    flexDirection: "row",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  button1: {
    backgroundColor: "#fc5c65",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button2: {
    backgroundColor: "#fd9644",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button3: {
    backgroundColor: "#fed330",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button4: {
    backgroundColor: "#26de81",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button5: {
    backgroundColor: "#2bcbba",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button6: {
    backgroundColor: "#45aaf2",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    margin: 20,
  },
  button7: {
    backgroundColor: "#4b7bec",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    margin: 20,
  },
  button8: {
    backgroundColor: "#a55eea",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    margin: 20,
  },
  button9: {
    backgroundColor: "#778ca3",
    borderRadius: 50,
    height: 95,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});

export default CategoriesScreen;

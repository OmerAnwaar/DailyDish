import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "@react-navigation/native";
import Colors from "../constants/Colors";

const SplashScreen = (props) => {
  //   const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6347" barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="fadeInDownBig"
          duraton="1500"
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      <Animatable.View
        style={[
          styles.footer,
          {
            backgroundColor: "white",
          },
        ]}
        animation="fadeInUpBig"
      >
        <Text
          style={[
            styles.title,
            {
              color: "black",
            },
          ]}
        >
          Find best food in your locality!
        </Text>
        <Text style={styles.text}>Sign in with account</Text>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Auth");
            }}
          >
            <LinearGradient
              colors={["#FFA07A", "#FF6347"]}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Get Started</Text>
              <Ionicons
                name={
                  Platform.OS === "android"
                    ? "md-arrow-forward"
                    : "ios-arrow-forward"
                }
                size={15}
                color="white"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

SplashScreen.navigationOptions = {
  headerTitle: "Get Started",
  headerStyle: {
    backgroundColor: "#fe6347",
    shadowColor: "transparent",
  },
  headerTintColor: "white",
};

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6347",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: "70%",
    height: "60%",
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 10,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 50,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 15,
  },
});
export default SplashScreen;

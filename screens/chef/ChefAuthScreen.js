import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Alert,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  SafeAreaView, 
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

import * as Animatable from "react-native-animatable";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { set } from "react-native-reanimated";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const ChefAuthScreen = (props) => {
  const db = firebase.firestore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [CheckCnic, setCheckCnic] = useState([]);
  const [cnicArr, setcnicArr] = useState([]);
  const dispatch = useDispatch();
  const [Checker, setChecker] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
      cnic: "",
      kitchenname: "",
      chefname: "",
      phnumber: "",
    },
    inputValidities: {
      email: false,
      password: false,
      cnic: false,
      kitchenname: false,
      chefname: false,
      phnumber: false,
    },
    formIsValid: false,
  });
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getCheckers();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (error) {
      Alert.alert("Please enter Email Address or Password!", error, [
        { text: "Okay" },
      ]);
    }
  }, [error]);

  const getCheckers = async () => {
    await db.collection("chefs").onSnapshot((snap) => {
      setCheckCnic(
        snap.docs.map((doc) => ({
          cnic: doc.data().cnic,
          KitchenName: doc.data().KitchenName,
          phnumber: doc.data().phnumber,
          id: doc.id,
        }))
      );
    });
  };
  const authHandler = async () => {
    let action;
    getCheckers();
    if (isSignup) {
      var boolCnic = CheckCnic.some(
        (item) => item.cnic === formState.inputValues.cnic
      );
      var boolPhnumber = CheckCnic.some(
        (item) => item.phnumber === formState.inputValues.phnumber
      );
      var boolKitchen = CheckCnic.some(
        (item) => item.KitchenName === formState.inputValues.kitchenname
      );
      console.log("hoja bhae", boolKitchen);
      if (boolCnic === true) {
        Alert.alert("CNIC already exist!");
      } else if (boolKitchen === true) {
        Alert.alert("Kitchen Name Already Exits!");
      } else if (boolPhnumber === true) {
        Alert.alert("Phone Number Already Registered!");
      } else if (
        boolPhnumber === false &&
        boolCnic === false &&
        boolKitchen === false
      ) {
        action = authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.chefname,
          formState.inputValues.phnumber,
          formState.inputValues.kitchenname,
          formState.inputValues.cnic
        );
        console.log("okay scene");
      }
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Chef");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#FF6347", "#fe6347"]} style={styles.gradient}>
        <View style={styles.header}>
          <Animatable.Image
            animation="fadeInDownBig"
            duraton="1500"
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <Animatable.View style={styles.Container} animation="fadeInUpBig">
          <Card style={styles.authContainer}>
            <ScrollView style={{flex: 1}}>
              <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="password"
                label="Password"
                // placeholder="password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              {isSignup == true ? (
                <View>
                  <Input
                    id="cnic"
                    label="CNIC (No spacing)"
                    // placeholder="password"
                    keyboardType="numeric"
                    required
                    minLength={13}
                    autoCapitalize="none"
                    errorText="Please enter a valid CNIC."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="kitchenname"
                    label="Set a Kitchen Name"
                    keyboardType="default"
                    required
                    minLength={5}
                    autoCapitalize="none"
                    errorText="Please enter a valid Kitchen Name , Min Length 5."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="chefname"
                    label="Chef Name:"
                    keyboardType="default"
                    required
                    minLength={5}
                    autoCapitalize="none"
                    errorText="Please enter a valid Name."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="phnumber"
                    label="Phone Number (03XXXXXXXXX):"
                    keyboardType="numeric"
                    required
                    autoCapitalize="none"
                    errorText="Please enter a Valid Number."
                    onInputChange={inputChangeHandler}
                    minLength={11}
                    initialValue=""
                  />
                  {/* {CheckCnic.map((cnic) => (
                    <Text key={cnic.id}>{cnic.cnic}</Text>
                  ))} */}
                </View>
              ) : (
                <></>
              )}

              <View style={styles.button}>
                <View style={styles.buttonContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Button
                      title={isSignup ? "Sign Up" : "Login"}
                      color={Colors.primary}
                      onPress={authHandler}
                    />
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                    color={Colors.accent}
                    onPress={() => {
                      setIsSignup((prevState) => !prevState);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </Card>
        </Animatable.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const { height } = Dimensions.get("screen");

ChefAuthScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-arrow-back"}
          color="white"
          onPress={() => {
            navData.navigation.navigate("Auth");
          }}
        />
      </HeaderButtons>
    ),
    headerStyle: {
      backgroundColor: "#FF6347",
      shadowColor: "transparent",
    },
    headerTintColor: "white",
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  gradient: {
    justifyContent: "center",
    // paddingLeft: 5,
  },
  logo: {
    width: 160,
    height: 150,
    padding: 20
  },
  authContainer: {
    width: "100%",
    height: 1000,
    maxWidth: 400,
    padding: 30,
    marginHorizontal: 7.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    paddingTop: "10%",
  },
});

export default ChefAuthScreen;

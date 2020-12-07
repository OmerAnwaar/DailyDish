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
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

import * as Animatable from "react-native-animatable";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Please enter Email Address or Password!", error, [
        { text: "Okay" },
      ]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
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
            <ScrollView>
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
                  id="KitchenName"
                  label="Set a Kitchen Name"
                  keyboardType="default"
                  required
                  minLength={5}
                  autoCapitalize="none"
                  errorText="Please enter a valid Kitchen."
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
                 label="Phone Number (03XX-XXXXXXX):"
                 keyboardType="numeric"
                 required
                 autoCapitalize="none"
                 errorText="Please enter a Name."
                 onInputChange={inputChangeHandler}
                 minLength={12}
                 initialValue=""
               />
                
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
    width: "60%",
    height: "40%",
  },
  authContainer: {
    width: "100%",
    height: 900,
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

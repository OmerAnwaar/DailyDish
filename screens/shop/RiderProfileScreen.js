import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ListItemSeparator from "../../components/UI/ListItemSeparator";
import Colors from "../../constants/Colors";
import { db } from "../../firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";

const RiderProfileScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
  const [loading, setLoading] = useState(false);
  const [Profile, setProfile] = useState({});
  const [timeStamp, settimeStamp] = useState("");
  const [reviewStatus, setreviewStatus] = useState(false);
  const [input, setinput] = useState("");
  useEffect(() => {
    setLoading(true);
    gettimeStamp();
    getProfile();

    return () => {
      gettimeStamp();
      getProfile();
    };
  }, []);
  const gettimeStamp = async () => {
    setLoading(true);
    let timeref = db.collection("riders").doc(ReduxCurrentUser);
    let allTime = await timeref.get();
    settimeStamp(allTime.data().timestamp.toDate().toString().slice(0, 21));
    setreviewStatus(allTime.data().reviewStatus);
    setLoading(false);
  };
  const setReview = async () => {
    let reviewref = db.collection("riders").doc(ReduxCurrentUser);
    await reviewref.update({
      review: input,
      reviewStatus: true,
    });
  };
  const reviewSetter = async () => {
    setLoading(true);
    setReview();
    gettimeStamp();
  };
  const getProfile = async () => {
    setLoading(true);
    db.collection("riders")
      .doc(ReduxCurrentUser)
      .onSnapshot((snap) => {
        setProfile({
          name: snap.data().UserName,
          email: snap.data().UserEmail,
          phnumber: snap.data().phnumber,
          timestamp: snap.data().timestamp,
        });
        setLoading(false);
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.screen}
      keyboardVerticalOffset={180}
    >
      <ScrollView style={styles.screen}>
        <View>
          {loading === true ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <Text style={styles.info}>
                  <Ionicons
                    name={Platform.OS === "android" ? "md-save" : "ios-save"}
                    size={28}
                  ></Ionicons>{" "}
                  YOUR PROFILE
                </Text>
                <Text style={styles.data}>
                  <Ionicons
                    name={
                      Platform.OS === "android" ? "md-person" : "ios-person"
                    }
                    size={23}
                  ></Ionicons>{" "}
                  Name: {Profile.name}
                </Text>
                <ListItemSeparator />
                {/* <Text style={styles.data}>
                  <Ionicons
                    name={
                      Platform.OS === "android" ? "md-filing" : "ios-filing"
                    }
                    size={23}
                  ></Ionicons>{" "}
                  Kitchen Name: {Profile.kitchenName}
                </Text> */}

                <ListItemSeparator />
                {/* <Text style={styles.data}>
                  <Ionicons
                    name={Platform.OS === "android" ? "md-pin" : "ios-pin"}
                    size={23}
                  ></Ionicons>{" "}
                  Address: {Profile.address}
                </Text> */}
                <ListItemSeparator />
                <Text style={styles.data}>
                  <Ionicons
                    name={Platform.OS === "android" ? "md-send" : "ios-send"}
                    size={23}
                  ></Ionicons>{" "}
                  Email Address: {Profile.email}{" "}
                </Text>
                <ListItemSeparator />
                <Text style={styles.data}>
                  <Ionicons
                    name={Platform.OS === "android" ? "md-call" : "ios-call"}
                    size={23}
                  ></Ionicons>{" "}
                  Mobile Number: {Profile.phnumber}
                </Text>
                <ListItemSeparator />
                <Text style={styles.data}>
                  <Ionicons
                    name={Platform.OS === "android" ? "md-time" : "ios-time"}
                    size={23}
                  ></Ionicons>{" "}
                  Joined On: {timeStamp}
                </Text>
                <ListItemSeparator />
                {reviewStatus === true ? (
                  <Text style={styles.data}>
                    Thanks For Reviewing DailyDish{" "}
                    <Ionicons
                      name={
                        Platform.OS === "android" ? "md-heart" : "ios-heart"
                      }
                      size={23}
                    ></Ionicons>
                  </Text>
                ) : (
                  <View>
                    <Text style={styles.reviewTitle}>
                      <Ionicons
                        name={
                          Platform.OS === "android" ? "md-pulse" : "ios-pulse"
                        }
                        size={25}
                      ></Ionicons>{" "}
                      What do you think of DailyDish?
                    </Text>
                    <View style={styles.inputCotainer}>
                      <TextInput
                        style={styles.input}
                        placeholder={"Give a one Liner Review!!"}
                        onChangeText={(e) => {
                          setinput(e);
                        }}
                      ></TextInput>
                    </View>

                    <View style={styles.btnContainer}>
                      <Button
                        style={styles.button}
                        color={
                          Platform.OS === "android" ? "white" : Colors.primary
                        }
                        label="review"
                        title="Send Review"
                        onPress={reviewSetter}
                        disabled={loading}
                      ></Button>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

RiderProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Profile",
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
    flex: 1,
    // alignItems: "center",
  },
  info: {
    backgroundColor: Colors.primary,
    textAlign: "center",
    padding: 15,
    fontSize: 20,
  },
  data: {
    padding: 20,
    fontSize: 20,
    justifyContent: "space-around",
    textAlign: "center",
  },
  reviewTitle: {
    paddingTop: "2%",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputCotainer: {
    paddingTop: "2%",
    left: "10%",
  },
  input: {
    fontSize: 16,
    width: "80%",
    height: "25%",
    textAlign: "center",
    borderBottomColor: "grey",
  },
  button: {
    padding: 5,
    height: 20,
  },
  btnContainer: {
    bottom: "10%",
  },
});

export default RiderProfileScreen;

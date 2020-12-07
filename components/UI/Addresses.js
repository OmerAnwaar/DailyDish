import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ViewMoreText from "react-native-view-more-text";

function Addresses(addresses) {
  const saved_address = "Saved Address";
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [SavedAddress, setSavedAddress] = useState([]);
  const [curr, setcurr] = useState("");
  const [err, seterr] = useState();
  const db = firebase.firestore();

  const currentAddress = async () => {
    await db.collection("app-users").doc(ReduxCurrentUser).update({
      CurrentAddress: addressfromlist,
    });
  };
  return (
    <View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {" "}
          <Ionicons
            name={Platform.OS == "android" ? "md-save" : "ios-save"}
            size={25}
            color="white"
          />
          {"  "}Saved Address
        </Text>
        {addresses.addresses === undefined ? (
          <View>
            <Text style={styles.defaultText}>{saved_address} </Text>
          </View>
        ) : (
          <View>
            <View style={styles.listItems}>
              {addresses.addresses.map((add, key) => (
                <View key={add} style={styles.internalListContainer}>
                  <Text key={add} style={styles.listText}>
                    {add}
                  </Text>

                  <Button
                    style={styles.button}
                    color="white"
                    title="Make this Current Address"
                    onPress={async () => {
                      await db
                        .collection("app-users")
                        .doc(ReduxCurrentUser)
                        .update({
                          CurrentAddress: add,
                        }).then(
                            Alert.alert("This is now your Current Address!")
                        );
                    }}
                  ></Button>
                </View>
              ))}

              {/* {console.log(addresses.addresses.map(ad=>(<Text> ok{ad}</Text>)))} */}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: Colors.primary,
    padding: 10,
    alignItems: "center",
    width: "100%",
    borderRadius: 3,
    flexGrow: 1,
  },
  listTitle: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
    padding: 5,
    fontWeight: "600",
    color: "white",
    paddingBottom: 5,
  },
  listText: {
    color: "white",
    padding: 5,

    width: 400,
    textAlign: "center",
  },
  defaultText: {
    textAlign: "center",
    padding: 20,
  },
  listItems: {},
  btnView: {
    width: "50%",
    marginLeft: 100,
    padding: 8,
  },
  button: {
    padding: 5,
    height: 20,
  },
  internalListContainer: {
    borderColor: "white",
    borderWidth: 1,
  },
});

export default Addresses;

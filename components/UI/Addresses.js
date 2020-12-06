import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { Entypo, Ionicons } from "@expo/vector-icons";

function Addresses(addresses) {
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [SavedAddress, setSavedAddress] = useState([]);
  const [err, seterr] = useState();
  const db = firebase.firestore();
//   const getSavedAddress = async () => {
//     await db
//       .collection("app-users")
//       .doc(ReduxCurrentUser)
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           console.log("Document recieved", doc.data().SavedAddress);
//           setSavedAddress(doc.data().SavedAddress);
//         } else {
//           console.log("no such doc bro");
//         }
//       })
//       .catch((error) => {
//         console.log("error agya!!!!!!!");
//         seterr(error);
//       });
//   };
//   useEffect(() => {
//     getSavedAddress();
//   }, []);

  return (
    <View>
      <Text style={styles.listTitle}>
        {" "}
        <Ionicons
          name={Platform.OS == "android" ? "md-save" : "ios-save"}
          size={25}
        />
        {"  "}Saved Address
      </Text>
      {addresses.addresses === undefined ? (
        <View>
          <Text style={styles.defaultText}>No Address Saved </Text>
        </View>
      ) : (
        <View>
          <View style={styles.listContainer}>
            <Text
              style={styles.listText}
              onPress={() => {
                Alert.alert("oye");
              }}
            >
              {addresses.addresses}
            </Text>
          </View>
        </View>
      )}
      {/* {console.log("oye=====>", addresses)}
    <Text>{addresses.addresses}</Text> */}
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
  },
  listTitle: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
    paddingTop: 20,
  },
  listText: {
    color: "white",
  },
  defaultText: {
    textAlign: "center",
    padding: 20,
  },
});

export default Addresses;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ViewMoreText from 'react-native-view-more-text';


function Addresses(addresses) {
  const saved_address = "Saved Address";
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [SavedAddress, setSavedAddress] = useState([]);
  const [Action, setAction] = useState()
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
      
      <View style={styles.listContainer} >
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
              {addresses.addresses.map((add) => (
                <Text style={styles.listText}>{add}</Text>
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
    color: "white"
  },
  listText: {
    color: "white",
    padding: 5,
  
    width: 400,
    textAlign: "center"
  },
  defaultText: {
    textAlign: "center",
    padding: 20,
  },
  listItems: {},
});

export default Addresses;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase/Firebase";

const OrderHistoryItem = (props) => {
  const [rated, setrated] = useState(false);
  const ratedLike = async () => {
    let rateRef = db.collection("products-view").doc(props.id);
    await rateRef.update({
      like: firebase.firestore.FieldValue.increment(1),
    });
    setrated(true);
  };
  const ratedDislike = async () => {
    let rateRef = db.collection("products-view").doc(props.key);
    await rateRef.update({
      dislike: firebase.firestore.FieldValue.increment(1),
    });
    setrated(true);
  };

  return (
    <View>
      <View style={styles.cartItem}>
        <View style={styles.itemData}>
          <Text style={styles.quantity}>{props.quantity} </Text>
          <Text style={styles.mainText}>{props.title}</Text>
        </View>
        <View style={styles.itemData}>
          <Text style={styles.mainText}>
            Rs {Number.parseInt(props.amount).toFixed(2)}
          </Text>

          {props.deletable && (
            <TouchableOpacity
              onPress={props.onRemove}
              style={styles.deleteButton}
            >
              <Ionicons
                name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                size={23}
                color="red"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* {rated===false?(
        <Text>
        Tell us how was your {props.title}?{"    "}
        <Ionicons
          color="green"
          name={Platform.OS === "android" ? "md-thumbs-up" : "ios-thumbs-up"}
          size={20}
          onPress={ratedLike}
        ></Ionicons>
        {"    "}{" "}
        <Ionicons
          color="red"
          name={
            Platform.OS === "android" ? "md-thumbs-down" : "ios-thumbs-down"
          }
          size={20}
          onPress={ratedDislike}
        ></Ionicons>{" "}
      </Text>

      ):(
        <Text style={styles.FedText}>Thanks For your Feedback!</Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,

    margin: "2%",
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#888",
    fontSize: 16,
  },
  mainText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 20,
  },
  FedText: {
    textAlign: "center",
  },
});

export default OrderHistoryItem;

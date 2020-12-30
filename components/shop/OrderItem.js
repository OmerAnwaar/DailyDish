import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { db } from "../../firebase/Firebase";
import * as firebase from "firebase";
import "firebase/firestore";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import OrderHistoryItem from "./OrderHistoryItem";
import { Entypo, Ionicons } from "@expo/vector-icons";

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [kanme, setkanme] = useState("");
  const [rated, setrated] = useState(false);
  const ratedLike = async () => {
    let rateRef = db.collection("chefs").doc(props.ownerId);
    await rateRef.update({
      like: firebase.firestore.FieldValue.increment(1),
    });
    let statusPutterRef = db.collection("orders").doc(props.id);
    await statusPutterRef.update({
      kitchenRated: true,
    });
    setrated(true);
  };
  const ratedDislike = async () => {
    let rateRef = db.collection("products-view").doc(props.ownerId);
    await rateRef.update({
      dislike: firebase.firestore.FieldValue.increment(1),
    });
    let statusPutterRef = db.collection("orders").doc(props.id);
    await statusPutterRef.update({
      kitchenRated: true,
    });
    setrated(true);
  };
  // let slicedArr = props.items;
  // slicedArr = slicedArr.slice(0, 1);
  const kitchenNameGetter = async () => {
    let kNameRef = db.collection("chefs").doc(props.ownerId);
    await kNameRef.get().then((res) => {
      setkanme(res.data().KitchenName);
    });
    let statusGetterRef = db.collection("orders").doc(props.id);
    await statusGetterRef.get().then((res) => {
      setrated(res.data().kitchenRated);
    });
  };
  useEffect(() => {
    kitchenNameGetter();
  }, []);

  return (
    <Card key={props.id} style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.kName}>{kanme}</Text>
      </View>
      {rated === false ? (
        <>
          <View style={styles.like}>
            <Ionicons
              onPress={ratedLike}
              color="green"
              name={
                Platform.OS === "android" ? "md-thumbs-up" : "ios-thumbs-up"
              }
              size={20}
            >
              {" "}
            </Ionicons>
          </View>
          <View style={styles.dislike}>
            <Ionicons
              onPress={ratedDislike}
              color="red"
              name={
                Platform.OS === "android" ? "md-thumbs-down" : "ios-thumbs-down"
              }
              size={20}
            >
              {" "}
            </Ionicons>
          </View>
        </>
      ) : (
        <View style={styles.feed}>
          <Text style={{ color: "green" }}>Thanks For your feedBack! </Text>
        </View>
      )}

      <View style={styles.summary}>
        <Text style={styles.totalAmount}>Rs {props.amount}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>

      <Button
        color={Colors.primary}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />
      {showDetails && (
        <View style={styles.detailItems}>
          {props.items.map((cartItem) => (
            <>
              {/* <Text>Kitchen Name: {cartItem.kitchenName}</Text> */}
              <OrderHistoryItem
                key={cartItem.productId}
                id={cartItem.productId}
                quantity={cartItem.quantity}
                amount={cartItem.sum}
                title={cartItem.productTitle}
                kitchenName={cartItem.kitchenName}
              />
              {/* idhr info dalni aur */}
            </>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  date: {
    fontSize: 14,
    fontFamily: "open-sans",
    color: "#888",
  },
  detailItems: {
    width: "100%",
  },

  kName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  like: {
    position: "absolute",
    right: "35%",
    bottom: "90%",

    borderRadius: 10,
  },
  dislike: {
    position: "absolute",
    right: "20%",
    bottom: "90%",

    borderRadius: 10,
  },
  feed: {
    position: "absolute",
    right: "8%",
    bottom: "90%",

    borderRadius: 10,
  },
});

export default OrderItem;

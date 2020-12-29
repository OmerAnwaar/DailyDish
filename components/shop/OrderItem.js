import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import OrderHistoryItem from "./OrderHistoryItem";

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  let slicedArr = props.items;
  slicedArr = slicedArr.slice(0, 1);

  return (
    <Card key={props.key} style={styles.orderItem}>
      <View style={styles.summary}>
        {slicedArr.map((cartItem) => (
          <Text key={cartItem.ownerId} style={styles.kName}>
            Kitchen Name: {cartItem.kitchenName}
          </Text>
        ))}
      </View>
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
});

export default OrderItem;

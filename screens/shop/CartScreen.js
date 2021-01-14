import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as firebase from "firebase";
import "firebase/firestore";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const CartScreen = (props) => {
  const db = firebase.firestore();
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [inCartObj, setinCartObj] = useState({});
  const [ExpoToken, setExpoToken] = useState("");
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const ProductOwner = useSelector((state) => state.cart.ownerId);
  let ProductId;
  console.log("ownerid=", ProductOwner);

  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      ProductId = key;
      console.log("i am cart items", state.cart.items);
      transformedCartItems.push({
        productId: key,
        ownerId: state.cart.items[key].ownerId,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        kitchenName: state.cart.items[key].kitchenName,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  console.log("product id=", ProductId);
  const getEtoken = async () => {
    let tokenRef = db.collection("chefs").doc(ProductOwner);
    await tokenRef.get().then((res) => {
      setExpoToken(res.data().expoToken);
    });
  };
  useEffect(() => {
    getEtoken();
  }, []);
  console.log("token brought", ExpoToken);
  const sendPushNotification = () => {
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: ExpoToken,
        sound: "default",
        title: "New Order",
        body: "You have recieved a new order!",
      }),
    });
  };
  const dispatch = useDispatch();
  // cartItems ={[ProductId]: transformedCartItems}
  const sendOrderHandler = async () => {
    setIsLoading(true);
    dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setTimeout(function () {
      props.navigation.navigate("SentOrders");
    }, 4000);
    setTimeout(() => {
      sendPushNotification();
    }, 2000);
   
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            Rs {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            addable
            onAdd={() => {
              dispatch(cartActions.addQuant(itemData.item));
            }}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;

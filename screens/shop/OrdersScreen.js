import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";
import { db } from "../../firebase/Firebase";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHistory, setOrderHistory] = useState([]);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  // const orderHistoryGetter = async () => {
  //   let orderHisRef = db
  //     .collection("app-users")
  //     .doc(ReduxCurrentUser)
  //     .collection("orders-history");
  //   let allorder = await orderHisRef.get();
  //   setOrderHistory(
  //     allorder.docs.map((doc) => ({
  //       KitchenName: doc.data().KitchenName,
  //       cartitems: doc.data().cartitems,
  //       date: doc.data().toDate().toString().slice(0, 21),
  //       totalBill: doc.data().totalBill,
  //     }))
  //   );
  //   console.log("main agya yahan================>:", OrderHistory);
  //   console.log("chal ja bhae")
  // };
  // useEffect(() => {
  //   orderHistoryGetter();
  //   return () => {
  //     orderHistoryGetter();
  //   };
  // }, []);
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Orders Found, maybe start ordering some products!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;

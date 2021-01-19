import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ignoreWarnings from "react-native-ignore-warnings";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";
import { db } from "../../firebase/Firebase";

const OrdersScreen = (props) => {
  ignoreWarnings("Each child in");
  const [refresh, setrefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHistory, setOrderHistory] = useState([]);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const orderGetter = async () => {
    setrefresh(true);
    let orderRef = db.collection("orders");
    await orderRef.get().then((res) => {
      setOrderHistory(
        res.docs.map((doc) => ({
          id: doc.id,
          CustomerName: doc.data().CustomerName,
          phnumber: doc.data().phnumber,
          CurrentAddr: doc.data().CurrentAddress,
          item: doc.data().items,
          ownerId: doc.data().ownerId,
          amount: doc.data().totalAmount,
          date: doc.data().timestamp.toDate().toString().slice(0, 21),
          orderStatus: doc.data().orderStatus,
          deliverystatus: doc.data().deliverystatus,
        }))
      );
      // res.docs.map((doc) => {
      //   console.log(doc.data());
      // });
    });
    setrefresh(false);
    // console.log("chal paya", OrderHistory);
  };

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

  const handleRefresh = () => {
    setrefresh(true);
    orderGetter();
    setrefresh(false);
  };

  useEffect(() => {
    orderGetter();
  }, []);
  const unsubscribe = props.navigation.addListener("didFocus", () => {
    orderGetter();
    console.log("focussed");
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (OrderHistory.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Orders Found, maybe start ordering some products!</Text>
        <Button label="refresh" title="refresh" onPress={orderGetter}></Button>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.Title}>Completed Orders. </Text>
      <Text style={styles.info}>
        Tell us how was your experience with these Kitchen?{" "}
      </Text>

      <FlatList
        refreshing={refresh}
        onRefresh={handleRefresh}
        data={OrderHistory}
        keyExtractor={(item) => item.item.id}
        renderItem={(itemData) => (
          <>
            {itemData.item.deliverystatus === "delivered" ? (
              <OrderItem
                amount={itemData.item.amount}
                date={itemData.item.date}
                items={itemData.item.item}
                id={itemData.item.id}
                key={itemData.item.id}
                ownerId={itemData.item.ownerId}
              />
            ) : (
              <></>
            )}
          </>
        )}
      />
    </View>
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
  Title: {
    textAlign: "center",
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    textAlign: "center",
  },
});

export default OrdersScreen;

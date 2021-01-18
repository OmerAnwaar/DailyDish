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
import SentOrderItem from "../../components/shop/SentOrderItem";
import * as ordersActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";
import { db } from "../../firebase/Firebase";

const SentOrderScreen = (props) => {
  ignoreWarnings("Each child in");
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHistory, setOrderHistory] = useState([]);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const orderGetter = async () => {
    let orderRef = db.collection("orders").orderBy("timestamp", "desc")
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
    console.log("pressed")
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
      <Text style={styles.Title}>
         Orders In Progress.{" "}
        <Ionicons
          onPress={orderGetter}
          name={Platform.OS === "android" ? "md-refresh" : "ios-refresh"}
          size={25}
        ></Ionicons>
      </Text>
      

      <FlatList
        data={OrderHistory}
        keyExtractor={(item) => item.item.id}
        renderItem={(itemData) => (
          <>
            {itemData.item.deliverystatus === "requested" || itemData.item.deliverystatus === "live" || itemData.item.deliverystatus === "accepted"  && itemData.item.orderStatus=== "accepted" || itemData.item.orderStatus=== "completed" ? (
              <SentOrderItem
                amount={itemData.item.amount}
                date={itemData.item.date}
                items={itemData.item.item}
                id={itemData.item.id}
                key={itemData.item.id}
                ownerId= {itemData.item.ownerId}
                deliverystatus={itemData.item.deliverystatus}
                orderStatus={itemData.item.orderStatus}
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

SentOrderScreen.navigationOptions = (navData) => {
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
  info:{
    textAlign: "center"
  }
});

export default SentOrderScreen;

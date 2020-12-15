import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { db } from "../../firebase/Firebase";
import ItemHolder from "../../components/categories/ItemHolder";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";

const RiderHomeScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
  console.log("current user rider", ReduxCurrentUser);
  const [orderRecieved, setorderRecieved] = useState([]);
  const [liveOrder, setliveOrder] = useState([]);
  const [id, setid] = useState("");
  const liveOrderGetter = async () => {
    // const orderInfoRef = db.collection("live-orders");
    // await orderInfoRef.get().then((res) => {
    //   setliveOrder(
    //     res.docs.map((doc) => ({
    //       id: doc.data().orderId,
    //       KitchenName: doc.data().KitchenName,
    //       KitchenAddress: doc.data().KitchenAddress,
    //       KitchenChef: doc.data().KitchenChef,
    //       Kitchenph: doc.data().Kitchenph,
    //       CustomerName: doc.data().CustomerName,
    //       Customerph: doc.data().Customerph,
    //       CustomerAddress: doc.data().CustomerAddress,
    //       Total: doc.data().Total,
    //       timestamp: doc.get().timestamp.toDate().toString().slice(0, 21),
    //     }))
    //   );
    // });

    const orederLive = db
      .collection("live-orders")
      .where("deliverystatus", "==", "inprogress");

    await orederLive.get().then((res) => {
      setliveOrder(
        res.docs.map((doc) => ({
          orderId: doc.data().orderId,
          CustomerName: doc.data().CustomerName,
          Customerphnumber: doc.data().Customerph,
          CustomerAddress: doc.data().CustomerAddress,
          Total: doc.data().Total,
          timestamp: doc.data().timestamp.toDate().toString().slice(0, 21),
          deliverystatus: doc.data().deliverystatus,
          KitchenName: doc.data().KitchenName,
          KitchenAddress: doc.data().KitchenAddress,
          Kitchenph: doc.data().Kitchenph,
        }))
      );
    });

    console.log("CHALLLLL JAAA BHAE", liveOrder);
  };

  const recievedOrders = async () => {
    const recievedOrderRef = db
      .collection("orders")
      .where("deliverystatus", "==", "live");

    await recievedOrderRef.get().then((res) => {
      setorderRecieved(
        res.docs.map((doc) => ({
          id: doc.id,
          CustomerName: doc.data().CustomerName,
          phnumber: doc.data().phnumber,
          CurrentAddr: doc.data().CurrentAddress,
          item: doc.data().items,
          totalAmount: doc.data().totalAmount,
          timestamp: doc.data().timestamp.toDate().toString().slice(0, 21),
          orderStatus: doc.data().orderStatus,
          deliverystatus: doc.data().deliverystatus,
        }))
      );
    });

    // setorderRecieved(
    //   recievedOrder.docs.map((doc) => ({
    //     id: doc.id,
    //     CustomerName: doc.data().CustomerName,
    //     phnumber: doc.data().phnumber,
    //     CurrentAddr: doc.data().CurrentAddr,
    //     productTitle: doc.data().productTitle,
    //     quantity: doc.data().quantity,
    //     productPrice: doc.data().productPrice,
    //     sum: doc.data().sum,
    //     timestamp: doc.data().timestamp.toDate().toString().slice(0, 21),
    //   }))
    // );
    console.log("hoja pae set ", orderRecieved);
    // recievedOrder.docs.map((doc) => {
    //   console.log("checking again again", doc.data());
    // });
  };
  const unsubscribe = props.navigation.addListener("didFocus", () => {
    liveOrderGetter();
    recievedOrders();
    console.log("focussed");
  });

  useEffect(() => {
    liveOrderGetter();
    recievedOrders();
    return () => {
      liveOrderGetter();
      recievedOrders();
    };
  }, []);

  if (orderRecieved.length == 0) {
    return (
      <View>
        <Text>Refresh maybe!</Text>
        <Button
          label="refresh"
          title="refresh"
          onPress={recievedOrders}
        ></Button>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Button label="refresh" title="refresh" onPress={recievedOrders}></Button>

      <FlatList
        data={liveOrder}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>Kitchen Name: {item.KitchenName}</Text>
            <Text>Kitchen Phone Number: {item.Kitchenph}</Text>
            <Text>Pick Up Address: {item.KitchenAddress}</Text>
            <Text>Customer Name: {item.CustomerName}</Text>
            <Text>Customer Address: {item.CustomerAddress}</Text>
            <Text>Delivery Address: {item.CustomerAddress}</Text>
            <Text>Total: {item.Total}</Text>
            <Text> Avaialibe From: {item.timestamp}</Text>
          </View>
        )}
      />
      </View>
 
  );
};

RiderHomeScreen.navigationOptions = (navData) => {
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
  screen: {
    flex: 1,
  },

  container:{
    borderColor:"grey",
    borderWidth: 2,
    borderRadius: 20,
    padding: "3%",
    margin: 10
 
  }
});

export default RiderHomeScreen;

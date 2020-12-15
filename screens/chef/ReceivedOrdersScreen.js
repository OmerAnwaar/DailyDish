import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { db } from "../../firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import ItemHolder from "../../components/categories/ItemHolder";
import * as firebase from "firebase";
import "firebase/firestore";
const ReceievedOrdersScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authChef.userId);
  const [recieved, setrecieved] = useState([]);
  const [loading, setloading] = useState(false);
  const [orderRecieved, setorderRecieved] = useState([]);
  const [orderStatus, setorderStatus] = useState("");
  const [Kname, setKname] = useState("");
  const [Cname, setCname] = useState("");
  const [Aname, setAname] = useState("");
  const [Pname, setPname] = useState("");

  const kitchenInfoGetter = async () => {
    const kitchenDataRef = db.collection("chefs").doc(ReduxCurrentUser);
    const kitchenData = await kitchenDataRef.get();
    setKname(kitchenData.data().KitchenName);
    setCname(kitchenData.data().ChefName);
    setAname(kitchenData.data().CurrentAddress);
    setPname(kitchenData.data().phnumber);
  };
  const recievedOrders = async () => {
    const recievedOrderRef = db
      .collection("orders")
      .where("ownerId", "==", ReduxCurrentUser);
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
    recievedOrders();
    kitchenInfoGetter();
    console.log("focussed");
  });

  useEffect(() => {
    kitchenInfoGetter();
    recievedOrders();
    return () => {
      recievedOrders();
      kitchenInfoGetter();
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
    <View>
      <Button label="refresh" title="refresh" onPress={recievedOrders}></Button>
      <FlatList
        data={orderRecieved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>Customer Name: {item.CustomerName}</Text>
            <Text>Customer Phone Number: {item.phnumber}</Text>
            <Text>Customer Address: {item.CurrentAddr}</Text>
            <Text> Placed On: {item.timestamp}</Text>
            <ItemHolder data={item.item} />
            <Text>Total: {item.totalAmount}</Text>
            <View>
              {item.orderStatus === "requested" ? (
                <>
                  <Button
                    label="accepting-order"
                    title="Accept Order"
                    onPress={() => {
                      db.collection("orders").doc(item.id).update({
                        orderStatus: "accepted",
                      });
                    }}
                  ></Button>
                  <Button
                    label="decline-order"
                    title="Decline Order"
                    onPress={() => {
                      db.collection("orders").doc(item.id).update({
                        orderStatus: "declined",
                      });
                    }}
                  ></Button>
                </>
              ) : (
                <>
                  {item.orderStatus === "accepted" ? (
                    <>
                      <Button
                        label="req-delivery"
                        title="Request Delivery"
                        onPress={() => {
                          db.collection("orders").doc(item.id).update({
                            orderStatus: "completed",
                            deliverystatus: "live",
                          });
                          db.collection("live-orders").add({
                            orderId: item.id,
                            KitchenName: Kname,
                            KitchenAddress: Aname,
                            KitchenChef: Cname,
                            Kitchenph: Pname,
                            CustomerName: item.CustomerName,
                            Customerph: item.phnumber,
                            CustomerAddress: item.CurrentAddr,
                            Total: item.totalAmount,
                            deliverystatus: "inprogress",
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          });
                        }}
                      ></Button>
                    </>
                  ) : (
                    <>
                      {item.orderStatus === "completed" ? (
                        <>
                          {item.deliverystatus === "accepted" ? (
                            <Text>
                              Rider is Assigned and will be there soon
                            </Text>
                          ) : (
                            <Text>Rider will accept delivery request soon</Text>
                          )}
                        </>
                      ) : (
                        <Text>You Turned Down this Order</Text>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

ReceievedOrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Received Orders",
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
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  container: {
    padding: "2%",
    margin: "2%",
    borderColor: "grey",
    borderWidth: 3,
    borderRadius: 10,
  },
});

export default ReceievedOrdersScreen;

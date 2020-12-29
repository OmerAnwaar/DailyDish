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
import Colors from "../../constants/Colors";
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
        contentContainerStyle={{ paddingBottom: 50 }}
        data={orderRecieved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Customer Name: </Text>
              <Text>{item.CustomerName}</Text>
            </View>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>
                Customer Phone Number:{" "}
              </Text>
              <Text>{item.phnumber}</Text>
            </View>
            <View style={styles.containAddress}>
              <Text style={{ fontWeight: "bold" }}>Customer Address: </Text>
              <Text>{item.CurrentAddr}</Text>
            </View>
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Placed On: </Text>
              <Text> {item.timestamp}</Text>
            </View>
            <ItemHolder data={item.item} />
            <View style={styles.contain}>
              <Text style={{ fontWeight: "bold" }}>Total: </Text>
              <Text>{item.totalAmount}</Text>
            </View>
            <View>
              {item.orderStatus === "requested" ? (
                <>
                  <View style={styles.selectButtons}>
                    {/* <View style={styles.AcceptStyle}> */}
                    <Button
                      style={styles.Buttons}
                      label="accepting-order"
                      title="Accept Order"
                      onPress={() => {
                        db.collection("orders").doc(item.id).update({
                          orderStatus: "accepted",
                        });
                      }}
                    ></Button>
                    {/* </View> */}
                    {/* <View style={styles.DeclineStyle}> */}
                    <Button
                      label="decline-order"
                      title="Decline Order"
                      color="red"
                      onPress={() => {
                        db.collection("orders").doc(item.id).update({
                          orderStatus: "declined",
                        });
                      }}
                    ></Button>
                    {/* </View> */}
                  </View>
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
                            <Text style={styles.rider}>
                              Rider will accept delivery request soon
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={styles.turnedDown}>
                          You Turned Down this Order
                        </Text>
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
    paddingBottom: 10,
    marginBottom: 20,
  },
  contain: {
    marginVertical: 1,
    flexDirection: "row",
  },
  container: {
    padding: "2%",
    margin: "2%",
    borderColor: "grey",
    // borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "white",
  },
  selectButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  // AcceptStyle: {
  //   backgroundColor: "#4f9bff",
  //   borderRadius: 50,
  //   borderColor: "black",
  //   height: 60,
  //   width: 60,
  // },
  // DeclineStyle: {
  //   backgroundColor: "red",
  //   borderRadius: 50,
  //   borderColor: "black",
  //   width: 60,
  //   height: 60,
  // },
  containAddress: {
    marginVertical: 1,
  },
  rider: {
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 3,
    color: Colors.primary,
  },
  turnedDown: {
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 3,
    color: "red",
  },
});

export default ReceievedOrdersScreen;

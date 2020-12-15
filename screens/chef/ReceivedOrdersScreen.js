import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { db } from "../../firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import ItemHolder from "../../components/categories/ItemHolder";
const ReceievedOrdersScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authChef.userId);
  const [recieved, setrecieved] = useState([]);
  const [loading, setloading] = useState(false);
  const [orderRecieved, setorderRecieved] = useState([]);

  const recievedOrders = async () => {
    const recievedOrderRef = db
      .collection("orders")
      .where("ownerId", "==", ReduxCurrentUser)
      .where("orderStatus", "==", "requested");
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
    console.log("focussed");
  });

  useEffect(() => {
    recievedOrders();
    return () => {
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
    <View>
      <FlatList
        data={orderRecieved}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>Customer Name: {item.CustomerName}</Text>
            <Text>Customer Phone Number: {item.phnumber}</Text>
            <Text>Customer Address: {item.CurrentAddr}</Text>

            <Text> Placed On: {item.timestamp}</Text>
            <ItemHolder data={item.item} />
            <Text>Total: {item.totalAmount}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
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

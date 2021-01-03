import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import { db } from "../../firebase/Firebase";
import ItemHolder from "../../components/categories/ItemHolder";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const RiderHomeScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
  console.log("current user rider", ReduxCurrentUser);
  const [orderRecieved, setorderRecieved] = useState([]);
  const [liveOrder, setliveOrder] = useState([]);
  const [id, setid] = useState("");
  // const testNotification = async () => {
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "hello",
  //       body: "testing",
  //     },
  //     trigger: {
  //       seconds: 2,
  //     },
  //   });
  // };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("You need to give access in order to recieve notification!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    await db.collection("riders").doc(ReduxCurrentUser).update({
      expoToken: token,
    });

    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //   name: 'default',
    //   importance: Notifications.AndroidImportance.MAX,
    //   vibrationPattern: [0, 250, 250, 250],
    //   lightColor: '#FF231F7C',
    //   });
    // }

    return token;
  };
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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
      .orderBy("timestamp", "desc");
    //.where("deliverystatus", "==", "inprogress")

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

  // const recievedOrders = async () => {
  //   const recievedOrderRef = db
  //     .collection("orders")
  //     .where("deliverystatus", "==", "live");

  //   await recievedOrderRef.get().then((res) => {
  //     setorderRecieved(
  //       res.docs.map((doc) => ({
  //         id: doc.id,
  //         CustomerName: doc.data().CustomerName,
  //         phnumber: doc.data().phnumber,
  //         CurrentAddr: doc.data().CurrentAddress,
  //         item: doc.data().items,
  //         totalAmount: doc.data().totalAmount,
  //         timestamp: doc.data().timestamp.toDate().toString().slice(0, 21),
  //         orderStatus: doc.data().orderStatus,
  //         deliverystatus: doc.data().deliverystatus,
  //       }))
  //     );
  //   });

  //   // setorderRecieved(
  //   //   recievedOrder.docs.map((doc) => ({
  //   //     id: doc.id,
  //   //     CustomerName: doc.data().CustomerName,
  //   //     phnumber: doc.data().phnumber,
  //   //     CurrentAddr: doc.data().CurrentAddr,
  //   //     productTitle: doc.data().productTitle,
  //   //     quantity: doc.data().quantity,
  //   //     productPrice: doc.data().productPrice,
  //   //     sum: doc.data().sum,
  //   //     timestamp: doc.data().timestamp.toDate().toString().slice(0, 21),
  //   //   }))
  //   // );
  //   console.log("hoja pae set ", orderRecieved);
  //   // recievedOrder.docs.map((doc) => {
  //   //   console.log("checking again again", doc.data());
  //   // });
  // };

  // const unsubscribe = props.navigation.addListener("didFocus", () => {
  //   liveOrderGetter();
  //   //recievedOrders();
  //   console.log("focussed");
  // });

  useEffect(() => {
    liveOrderGetter();
    //recievedOrders();
    return () => {
      liveOrderGetter();
      //recievedOrders();
    };
  }, []);

  if (liveOrder.length == 0) {
    return (
      <View>
        <Text>Refresh maybe!</Text>
        <Button
          label="refresh"
          title="refresh"
          onPress={liveOrderGetter}
        ></Button>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* <Button title="Testing" onPress={testNotification} /> */}
      <Text style={styles.RiderTitle}>
        <Ionicons
          name={Platform.OS === "android" ? "md-bicycle" : "ios-bicycle"}
          size={28}
        ></Ionicons>{" "}
        Welcome Rider{" "}
      </Text>
      <Ionicons
        style={styles.Refresh}
        size={24}
        name={Platform.OS === "android" ? "md-refresh" : "ios-refresh"}
        onPress={liveOrderGetter}
      ></Ionicons>

      <FlatList
        data={liveOrder}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {item.deliverystatus === "inprogress" ? (
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
            ) : (
              <></>
            )}
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
  RiderTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  Refresh: {
    textAlign: "right",
    marginRight: "10%",
  },
});

export default RiderHomeScreen;

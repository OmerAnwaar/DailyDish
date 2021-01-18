import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import * as Location from "expo-location";
import { db } from "../../firebase/Firebase";
import ItemHolder from "../../components/categories/ItemHolder";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Geocoder from "react-native-geocoding";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import LocationGetter from "./LocationGetter";
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});
const initialLocation = {
  latitude: 0.0,
  longitude: 0.0,
  latitudeDelta: 0.0025,
  longitudeDelta: 0.0015,
};

const RiderHomeScreen = (props) => {
  const [latChef, setlatChef] = useState("");
  const [longChef, setlongChef] = useState("");
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
  console.log("current user rider", ReduxCurrentUser);
  const [pickedLocation, setPickedLocation] = useState(initialLocation);
  const [orderRecieved, setorderRecieved] = useState([]);
  //const [latChef, setlatChef] = useState("")
  const [liveOrder, setliveOrder] = useState([]);
  const [id, setid] = useState("");
  Geocoder.init("AIzaSyBCSNe6FSjhJtL8iENJ8bk25HjCd0ApAWc");
  const _getlocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("PERMSSION NOT GRANTED");
      seterror({ error: "Location Permission not Granted" });
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: error }]
      );
      return false;
    }
    
    const location = await Location.getCurrentPositionAsync();

    setPickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.00019,
      longitudeDelta: 0.0019,
    });

    console.log(pickedLocation);

    return true;
  };
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
  const unsubscribe = props.navigation.addListener("didFocus", () => {
    _getlocation();
    console.log("focussed");
  });
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
          id: doc.id,
          kitchenId: doc.data().kitchenId,
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
          KitchenLong: doc.data().KitchenLong,
          KitchenLat: doc.data().KitchenLat
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
    _getlocation();
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
        onPress={() => {
          liveOrderGetter();
        }}
      ></Ionicons>

      <FlatList
        data={liveOrder}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {item.deliverystatus === "inprogress" ? (
              <>
                <LocationGetter
                  kitchenId={item.kitchenId}
                  riderLat={pickedLocation.latitude}
                  riderLong={pickedLocation.longitude}
                  KitchenName={item.KitchenName}
                  Kitchenph={item.Kitchenph}
                  KitchenAddress={item.KitchenAddress}
                  CustomerName={item.CustomerName}
                  CustomerAddress={item.CustomerAddress}
                  Total={item.Total}
                  KitchenLat={item.KitchenLat}
                  KitchenLong={item.KitchenLong}
                  timestamp={item.timestamp}
                />
                
              
                {/* <Text>Kitchen Name: {item.KitchenName}</Text>
                <Text>Kitchen Phone Number: {item.Kitchenph}</Text>
                <Text>Pick Up Address: {item.KitchenAddress}</Text>
                <Text>Customer Name: {item.CustomerName}</Text>
                <Text>Customer Address: {item.CustomerAddress}</Text>
                <Text>Delivery Address: {item.CustomerAddress}</Text>
                <Text>Total: {item.Total}</Text>
                <Text> Avaialibe From: {item.timestamp}</Text> */}
              </>
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

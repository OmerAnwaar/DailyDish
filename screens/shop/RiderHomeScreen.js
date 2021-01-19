import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, FlatList, Alert } from "react-native";
import * as Location from "expo-location";
import * as firebase from "firebase";
import "firebase/firestore";
import { db } from "../../firebase/Firebase";
import ItemHolder from "../../components/categories/ItemHolder";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Geocoder from "react-native-geocoding";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import * as RiderAction from "../../store/actions/authRider";
import getDistance from "geolib/es/getPreciseDistance";
import Constants from "expo-constants";
import LocationGetter from "./LocationGetter";
import { setNotificationHandler } from "expo-notifications";
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
  const [refresh, setrefresh] = useState(false);
  const [latChef, setlatChef] = useState("");
  const [longChef, setlongChef] = useState("");
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
  const [pickedLocation, setPickedLocation] = useState(initialLocation);
  const [orderRecieved, setorderRecieved] = useState([]);
  const [distance, setdistance] = useState(0);
  const [cheftoken, setcheftoken] = useState("");
  const [usertoken, setusertoken] = useState("");
  const [loading, setloading] = useState(false);
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
  const CheckStatus = async () => {
    let checkChefRef = db.collection("riders").doc(ReduxCurrentUser);
    let statusGetter = await checkChefRef.get();
    //setChefStatus( statusGetter.data().chefStatus)
    let chefStat = statusGetter.data().Disable;
    console.log("Ye Disable status mila hai", chefStat);
    if (chefStat === true) {
      Alert.alert("You have been disabled by the Admin!");
      props.navigation.navigate("Auth");
      RiderAction.logout();
    }
  };

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
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      _getlocation();
      liveOrderGetter();
      console.log("focussed");
    });
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const liveOrderGetter = async () => {
    setrefresh(true);
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
          CustomerId: doc.data().CustomerId,
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
          KitchenLat: doc.data().KitchenLat,
        }))
      );
    });

    console.log("CHALLLLL JAAA BHAE", liveOrder);
    setrefresh(false);
  };
  let dst;
  const locationget = (KitchenLat, KitchenLong) => {
    setloading(true);
    // let locRef  = db.collection("chefs").doc(props.kitchenId)
    // let loc = await locRef.get()
    // setlatChef(loc.data().location.U)
    // setlongChef(loc.data().location.k)
    //   .then((res) => {
    //     setlatChef(res.data().location.U);
    //     setlongChef(res.data().location.k);
    //   });

    var dist = getDistance(
      { latitude: KitchenLat, longitude: KitchenLong },
      { latitude: pickedLocation.latitude, longitude: pickedLocation.longitude }
    );
    // setdistance(Math.round(dist / 1000));
    dst = Math.round(dist / 1000);
    setloading(false);
    return dst;
    // setdistance(dist / 1000);
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
    CheckStatus();
    liveOrderGetter();
    _getlocation();

    //recievedOrders();
    return () => {
      liveOrderGetter();
      //recievedOrders();
    };
  }, []);
  const handleRefresh = () => {
    setrefresh(true);
    liveOrderGetter();
    setrefresh(false);
  };
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

      <FlatList
        data={liveOrder}
        refreshing={refresh}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {item.deliverystatus === "inprogress" &&
            locationget(item.KitchenLat, item.KitchenLong) <= 5 ? (
              <>
                <View style={styles.container}>
                  {/* <Text>Lat: {props.KitchenLat}</Text>
                  <Text>Long: {props.KitchenLong}</Text>
                  <Text>Rider Lat: {props.riderLat}</Text>
                  <Text>Rider Long : {props.riderLong}</Text> */}
                  <Text>
                    Distance from Kitchen:{" "}
                    {locationget(item.KitchenLat, item.KitchenLong)} Km
                  </Text>
                  <Text>Kitchen Name: {item.KitchenName}</Text>
                  <Text>Kitchen Phone Number: {item.Kitchenph}</Text>
                  <Text>Pick Up Address: {item.KitchenAddress}</Text>
                  <Text>Customer Name: {item.CustomerName}</Text>
                  <Text>Delivery Address: {item.CustomerAddress}</Text>
                  <Text>Total to be paid: {item.Total - 30}</Text>
                  <Text>Delivery Fee: Rs 30</Text>
                  <Text>Total to be collected: {item.Total}</Text>
                  <Text> Avaialibe From: {item.timestamp}</Text>
                  <View>
                    {item.deliverystatus === "inprogress" ? (
                      <Button
                        label="Accept"
                        title="Accept"
                        onPress={() => {
                          let cfToken;
                          db.collection("chefs")
                            .doc(item.kitchenId)
                            .get()
                            .then((res) => {
                              cfToken = res.data().expoToken;
                              fetch("https://exp.host/--/api/v2/push/send", {
                                method: "POST",
                                headers: {
                                  Accept: "application/json",
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  to: cfToken,
                                  sound: "default",
                                  title: "Rider Assigned!",
                                  body: "Rider will pick up the order soon",
                                }),
                              });
                            });
                          db.collection("live-orders").doc(item.id).update({
                            deliverystatus: "accepted",
                          });
                          db.collection("orders").doc(item.orderId).update({
                            deliverystatus: "accepted",
                          });
                          db.collection("riders")
                            .doc(ReduxCurrentUser)
                            .collection("rides")
                            .doc()
                            .set({
                              kitchenId: item.kitchenId,
                              orderId: item.orderId,
                              CustomerName: item.CustomerName,
                              Customerphnumber: item.Customerphnumber,
                              CustomerAddress: item.CustomerAddress,
                              Total: item.Total,
                              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                              deliverystatus: "accepted",
                              KitchenName: item.KitchenName,
                              KitchenAddress: item.KitchenAddress,
                              Kitchenph: item.Kitchenph,
                              KitchenLong: item.KitchenLong,
                              KitchenLat: item.KitchenLat,
                              CustomerId: item.CustomerId,
                            });

                          liveOrderGetter();
                          setTimeout(() => {
                            props.navigation.navigate("RiderOrder");
                          }, 2000);
                        }}
                      ></Button>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>

                {/* <LocationGetter
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
                  deliverystatus={item.deliverystatus}
                  currentuser={ReduxCurrentUser}
                /> */}

                {/* <Text>{locationget(item.KitchenLat, item.KitchenLong)}</Text>
                <Text>picked loc: {pickedLocation.latitude}</Text>
                <Text>picked loc: {pickedLocation.longitude}</Text>
                <Text>kitchen loc: {item.KitchenLat}</Text>
                <Text>kitchen loc: {item.KitchenLong}</Text>
                <Text>distance : {distance}</Text> */}

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

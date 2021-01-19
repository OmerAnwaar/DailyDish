import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import * as firebase from "firebase";
import Constants from "expo-constants";
import "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const RiderOrderScreen = (props) => {
  const [ride, setride] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
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

  const rideGetter = async () => {
    setrefresh(true);
    let riderRef = db
      .collection("riders")
      .doc(ReduxCurrentUser)
      .collection("rides")
      .orderBy("timestamp", "desc");

    riderRef.get().then((res) => {
      setride(
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
    // console.log(ride);
    setrefresh(false);
  };

  useEffect(() => {
    rideGetter();
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      rideGetter();
      console.log("focussed");
    });
    return () => {
      unsubscribe;
    };
  }, []);
  const handleRefresh = () => {
    setrefresh(true);
    rideGetter();
    setrefresh(false);
  };
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your Deliveries</Text>
      <FlatList
        data={ride}
        onRefresh={handleRefresh}
        refreshing={refresh}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text>Kitchen Name: {item.KitchenName}</Text>
            <Text>Kitchen Phone Number: {item.Kitchenph}</Text>
            <Text>Pick Up Address: {item.KitchenAddress}</Text>
            <Text>Customer Name: {item.CustomerName}</Text>
            <Text>Delivery Address: {item.CustomerAddress}</Text>
            <Text>Total to be paid: {item.Total - 30}</Text>
            <Text>Delivery Fee: Rs 30</Text>
            <Text>Total to be collected: {item.Total}</Text>
            <Text> Avaialibe From: {item.timestamp}</Text>
            {item.deliverystatus === "accepted" ? (
              <Button
                title="Confirm Pick Up"
                onPress={() => {
                  let customToken;
                  db.collection("app-users")
                    .doc(item.CustomerId)
                    .get()
                    .then((res) => {
                      customToken = res.data().expoToken;
                      fetch("https://exp.host/--/api/v2/push/send", {
                        method: "POST",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          to: customToken,
                          sound: "default",
                          title: "Order Picked Up!",
                          body: "Rider is on way",
                        }),
                      });
                    });
                  db.collection("orders").doc(item.orderId).update({
                    deliverystatus: "onway",
                  });
                  db.collection("riders").doc(ReduxCurrentUser).collection("rides").doc(item.id).update({
                    deliverystatus: "onway"
                  })

                  rideGetter();
                }}
              ></Button>
            ) : (
              <>
                {item.deliverystatus == "onway" ? (
                  <Button
                    title="Confirm Delivery"
                    label="Confirm Delivery"
                    onPress={() => {
                      let custToken;
                      db.collection("app-users")
                        .doc(item.CustomerId)
                        .get()
                        .then((res) => {
                          custToken = res.data().expoToken;
                          fetch("https://exp.host/--/api/v2/push/send", {
                            method: "POST",
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              to: custToken,
                              sound: "default",
                              title: "Thanks!",
                              body: "Do Share Your FeedBack!",
                            }),
                          });
                        });
                        db.collection("riders").doc(ReduxCurrentUser).collection("rides").doc(item.id).update({
                          deliverystatus: "delivered",
                          deliverAt: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        db.collection("orders").doc(item.orderId).update({
                          deliverystatus: "delivered",
                        });

      
                      rideGetter();
                    }}
                  ></Button>
                ) : (
                  <Text style={styles.sucess}>Job Completed!</Text>
                )}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

RiderOrderScreen.navigationOptions = (navData) => {
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
  hello: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  saad: {
    textAlign: "center",
    paddingTop: 300,
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
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  sucess:{
    textAlign: "center",
    paddingTop: "5%",
    color: "green",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default RiderOrderScreen;

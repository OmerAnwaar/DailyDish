import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import getDistance from "geolib/es/getPreciseDistance";
import { db } from "../../firebase/Firebase";
import { Accuracy } from "expo-location";
const LocationGetter = (props) => {
  const [latChef, setlatChef] = useState("");
  const [longChef, setlongChef] = useState("");
  const [distance, setdistance] = useState(0);
  const [loading, setloading] = useState(false);
  const locationget = async () => {
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
      { latitude: props.KitchenLat, longitude: props.KitchenLong },
      { latitude: props.riderLat, longitude: props.riderLong }
    );
    setdistance(Math.round(dist / 1000));
    // setdistance(dist / 1000);
    setloading(false);
  };
  //   const calculatingDistance = () => {
  //     var dist = getDistance(
  //       { latitude: latChef, longitude: longChef },
  //       { latitude: props.riderLat, longitude: props.riderLong }
  //     );
  //     // setdistance(Math.round(dist / 1000));
  //     setdistance(dist / 1000);
  //     // var radlat1 = (Math.PI * latChef) / 180;
  //     // var radlat2 = (Math.PI * props.riderLat) / 180;
  //     // var theta = longChef - props.riderLong;
  //     // var radtheta = (Math.PI * theta) / 180;
  //     // var dist =
  //     //   Math.sin(radlat1) * Math.sin(radlat2) +
  //     //   Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     // dist = Math.acos(dist);
  //     // dist = (dist * 180) / Math.PI;
  //     // dist = dist * 60 * 1.1515;
  //     // dist = dist * 1.609344;

  // setdistance(dist);
  //};

  useEffect(() => {
    setloading(true);
    locationget();
    setloading(false);
  }, []);
const riderassigned =()=>{
  db.collection("live-orders").doc(props.currentuser).update({
    deliverystatus: "accepted"
  })

}
  return (
    <View>
      {loading == true ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          {distance >= 0 ? (
            <View style={styles.container}>
              <Text>Lat: {props.KitchenLat}</Text>
              <Text>Long: {props.KitchenLong}</Text>
              <Text>Rider Lat: {props.riderLat}</Text>
              <Text>Rider Long : {props.riderLong}</Text>
              <Text>Distance from Kitchen: {distance} Km</Text>
              <Text>Kitchen Name: {props.KitchenName}</Text>
              <Text>Kitchen Phone Number: {props.Kitchenph}</Text>
              <Text>Pick Up Address: {props.KitchenAddress}</Text>
              <Text>Customer Name: {props.CustomerName}</Text>
              <Text>Delivery Address: {props.CustomerAddress}</Text>
              <Text>Total to be paid: {props.Total - 30}</Text>
              <Text>Delivery Fee: Rs 30</Text>
              <Text> Avaialibe From: {props.timestamp}</Text>
              <View>
                {props.deliverystatus === "inprogress" ? (
                  <Button label="Accept" title="Accept" onPress={riderassigned}></Button>
                ) : (
                  <></>
                )}
              </View>
            </View>
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
};
export default LocationGetter;
const styles = StyleSheet.create({
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
});

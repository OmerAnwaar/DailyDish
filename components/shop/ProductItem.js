import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";

import { color } from "react-native-reanimated";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase/Firebase";

import Card from "../UI/Card";

const ProductItem = (props) => {
  const [like, setlike] = useState(0);
  const [dislike, setdislike] = useState(0);

  const ratingGetter = async () => {
    let rateGetterRef = db.collection("chefs").doc(props.ownerId);
    const rater = await rateGetterRef.get();
    setlike(rater.data().like);
    setdislike(rater.data().dislike);
  };

  useEffect(() => {
    ratingGetter();
  }, []);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.like}>
              <Ionicons
                color="green"
                name={
                  Platform.OS === "android" ? "md-thumbs-up" : "ios-thumbs-up"
                }
                size={18}
              >
                {" "}
                {like}
              </Ionicons>
            </View>
            <View style={styles.dislike}>
              <Ionicons
                color="red"
                name={
                  Platform.OS === "android"
                    ? "md-thumbs-down"
                    : "ios-thumbs-down"
                }
                size={18}
              >
                {" "}
                {dislike}
              </Ionicons>
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title} </Text>

              <Text style={styles.kitchen}>{props.kitchenName} </Text>

              <Text style={styles.time}>{props.timestamp}</Text>
              <Text style={styles.price}>Rs {props.price}</Text>
            </View>

            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 320,
    width: "92%",
    margin: 20,
    borderRadius: 15,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    height: "17%",
    padding: 10,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 2,
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 15,
    color: "#888",
    marginVertical: 4,
    bottom: "35%",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
  kitchen: {
    marginVertical: 2,
    fontFamily: "open-sans-bold",
    fontSize: 16,
    right: "2%",
    color: "#95a5a6",
    marginLeft: "2%",
  },
  time: {
    paddingBottom: "2%",
    bottom: "25%",
  },
  like: {
    position: "absolute",
    right: "35%",
    bottom: "20%",

    borderRadius: 10,
  },
  dislike: {
    position: "absolute",
    right: "20%",
    bottom: "20%",

    borderRadius: 10,
  },
});

export default ProductItem;

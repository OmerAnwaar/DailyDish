import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import { db } from "../../firebase/Firebase";

const ProductDetailScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const productId = props.navigation.getParam("productId");
  const ownerId = props.navigation.getParam("ownerId");
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );
  const dispatch = useDispatch();
  const selectItemHandler = (ownerId) => {
    props.navigation.navigate("AllProd", {
      ownerId: ownerId,
    });
  };
  const favouriteAction = () => {
    console.log("current user", ReduxCurrentUser);
    console.log("id", selectedProduct.id);

    db.collection("app-users")
      .doc(ReduxCurrentUser)
      .collection("favourite")
      .doc(selectedProduct.id)
      .set({
        KitchenName: selectedProduct.kitchenName,
        ownerId: selectedProduct.ownerId,
        description: selectedProduct.description,
        imageUrl: selectedProduct.imageUrl,
        price: selectedProduct.price,
        title: selectedProduct.title,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    Alert.alert("Added to Favourites!");
  };
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />

        <Button
          color={Colors.primary}
          title={selectedProduct.kitchenName}
          onPress={() => {
            selectItemHandler(selectedProduct.ownerId);
          }}
        />
        <Button
          color={Colors.primary}
          title="Add to Favourites"
          onPress={favouriteAction}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.price}>
          Rs {Number.parseInt(selectedProduct.price).toFixed(2)}/-
        </Text>
        <Text style={styles.desTitle}>Description: </Text>
        <Text style={styles.description}>{selectedProduct.description}</Text>
      </View>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold",
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 15,
    textAlign: "center",
    marginHorizontal: 20,
  },
  desTitle: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    paddingBottom: "2%",
  },
  heart: {},
  container: {
    height: "30%",
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
    justifyContent: "center",
  },
});

export default ProductDetailScreen;

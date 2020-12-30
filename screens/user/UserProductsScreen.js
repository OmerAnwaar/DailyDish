import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  Button,
  Platform,
  Alert,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Entypo, Ionicons } from "@expo/vector-icons";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/Chefproducts";
import ignoreWarnings from "react-native-ignore-warnings";
import { db } from "../../firebase/Firebase";

const UserProductsScreen = (props) => {
  const ReduxCurrentUser = useSelector((state) => state.authChef.userId);
  const [like, setlike] = useState(0);
  const [dislike, setdislike] = useState(0);
  const rategetter = async () => {
    let rateRef = db.collection("chefs").doc(ReduxCurrentUser);
    await rateRef.get().then((res) => {
      setlike(res.data().like);
      setdislike(res.data().dislike);
    });
  };
  useEffect(() => {
    rategetter();
  }, []);
  const userProducts = useSelector((state) => state.chefproducts.userProducts);
  const dispatch = useDispatch();
  ignoreWarnings("Each child in");
  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        },
      },
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Products Found, maybe start creating some!</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.kitchenNameContainer}>
        {userProducts.slice(0, 1).map((docs) => (
          <Text key={docs.id} style={styles.name}>
            <Ionicons
              name={Platform.OS === "android" ? "md-basket" : "ios-basket"}
              size={28}
            ></Ionicons>{" "}
            {docs.kitchenName}
          </Text>
        ))}
        <Ionicons
          style={styles.refresh}
          name={Platform.OS === "android" ? "md-refresh" : "ios-refresh"}
          size={25}
          onPress={() => {
            dispatch(productsActions.fetchProducts());
            rategetter()
          }}
        ></Ionicons>

        <View style={styles.like}>
          <Ionicons
            color="#f1c40f"
            name={Platform.OS === "android" ? "md-happy" : "ios-happy"}
            size={26}
          >
            {" "}
            {like}
          </Ionicons>
        </View>
        <View style={styles.dislike}>
          <Ionicons
            color="red"
            name={Platform.OS === "android" ? "md-sad" : "ios-sad"}
            size={26}
          >
            {" "}
            {dislike}
          </Ionicons>
        </View>
      </View>
      <FlatList
        data={userProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            // image={itemData.item.imageUri}
            title={itemData.item.title}
            timestamp={itemData.item.timestamp}
            price={itemData.item.price}
            productID={itemData.item.id}
            ownerId={itemData.item.ownerId}
            onSelect={() => {
              editProductHandler(itemData.item.id);
            }}
          >
            <Button
              color={Colors.primary}
              title="Edit"
              onPress={() => {
                editProductHandler(itemData.item.id);
              }}
            />
            <Button
              color={Colors.primary}
              title="Delete"
              onPress={deleteHandler.bind(this, itemData.item.id)}
            />
          </ProductItem>
        )}
      />
    </>
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  kitchenNameContainer: {
    textAlign: "center",
    justifyContent: "center",
    padding: 20,
  },
  name: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  refresh: {
    alignSelf: "flex-end",
  },
  like: {
    position: "absolute",
    right: "65%",
    bottom: "20%",

    borderRadius: 10,
  },
  dislike: {
    position: "absolute",
    right: "38%",
    bottom: "20%",

    borderRadius: 10,
  },
});

export default UserProductsScreen;

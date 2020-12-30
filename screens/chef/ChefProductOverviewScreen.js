import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
// import { SearchBar } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/Chefproducts";
import Colors from "../../constants/Colors";
import SearchBar from "../../components/UI/SearchBar";
import UserName from "../user/UserName";
import { db } from "../../firebase/Firebase";
const ChefProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState();
  const [currAdd, setcurrAdd] = useState("notset");
  const [userName, setuserName] = useState("");
  const products = useSelector((state) => state.chefproducts.availableProducts);
  const filtered = useSelector((state) => state.chefproducts.userProducts);
  const dispatch = useDispatch();
  //const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const ReduxCurrentUser = useSelector((state) => state.authChef.userId);
  console.log("filtered=================>", filtered);

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const filteredProducts = products.filter((products) => {
    return products.title.toLowerCase().includes(search.toLowerCase());
  });
  // if (currAdd === "notset") {
  //   return (
  //     <>
  //       <Text>Loading</Text>
  //       {Alert.alert(
  //         "Set Your Address",
  //         "Before Proceeding Set your Address!",
  //         [
  //           {
  //             text: "Set Address",
  //             onPress: () =>  props.navigation.navigate("Address"),
  //           },
  //         ]
  //       )}
  //     </>
  //   );
  // }
  return (
    <>
      <SearchBar onChangeText={(e) => setSearch(e.target.value)} />
      {/* <Text style={styles.title}>Latest Additions</Text> */}

      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            kitchenName={itemData.item.kitchenName}
            productID={itemData.item.id}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            />
            {/* <Button
              color={Colors.primary}
              title="To Cart"
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
            /> */}
          </ProductItem>
        )}
      />
    </>
  );
};

ChefProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    paddingLeft: 15,
    marginTop: 15,
    paddingBottom: 15,
    fontSize: 20,
    borderBottomColor: "#26a69a",
    borderBottomWidth: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    marginTop: "2%",
    color: "#95a5a6",
  },
});

export default ChefProductsOverviewScreen;

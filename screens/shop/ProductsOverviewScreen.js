import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert
} from "react-native";
import * as userAction from '../../store/actions/auth'
// import { Notifications } from 'expo-notifications';
import { useSelector, useDispatch } from "react-redux";
// import { SearchBar } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Colors";
import SearchBar from "../../components/UI/SearchBar";
import UserName from "../user/UserName";
import { db } from "../../firebase/Firebase";
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

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState();
  const [userName, setuserName] = useState("");
  // const [token, settoken] = useState("");
  const products = useSelector((state) => state.products.availableProducts);
  const filtered = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
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
    let checkChefRef = db.collection("app-users").doc(ReduxCurrentUser);
    let statusGetter = await checkChefRef.get();
    //setChefStatus( statusGetter.data().chefStatus)
    let chefStat = statusGetter.data().Disable;
    console.log("Ye Disable status mila hai", chefStat);
    if (chefStat === true) {
      Alert.alert("You have been disabled by the Admin!");
      props.navigation.navigate("Auth");
      userAction.logout()
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

    await db.collection("app-users").doc(ReduxCurrentUser).update({
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
      CheckStatus()
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title, ownerId) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
      ownerId: ownerId,
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

  return (
    <>


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
            ownerId={itemData.item.ownerId}
            productID={itemData.item.id}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.title,
                itemData.item.ownerId
              );
            }}
          >
            <Button
              color={Colors.primary}
              title="To Cart"
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
          </ProductItem>
        )}
      />
    </>
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
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

export default ProductsOverviewScreen;

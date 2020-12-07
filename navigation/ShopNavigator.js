import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import {
  createAppContainer,
  createSwitchNavigator,
  withOrientation,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from "react-navigation-drawer";
import {
  Platform,
  SafeAreaView,
  Button,
  View,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import SplashScreen from "../screens/SplashScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/chef/EditProductScreen";
import ChefProfileScreen from "../screens/chef/ChefProfileScreen";
import ReceivedOrdersScreen from "../screens/chef/ReceivedOrdersScreen";
import UserProfileScreen from "../screens/user/UserProfileScreen";
import SentOrdersScreen from "../screens/shop/SentOrdersScreen";

import Colors from "../constants/Colors";
import AuthScreen from "../screens/user/AuthScreen";
import ChefAuthScreen from "../screens/chef/ChefAuthScreen";
import StartupScreen from "../screens/StartupScreen";

import * as authActions from "../store/actions/auth";
import LocationScreen from "../screens/user/LocationScreen";
import { db } from "../firebase/Firebase";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const SentOrdersNavigator = createStackNavigator(
  {
    SentOrders: SentOrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const ReceivedOrdersNavigator = createStackNavigator(
  {
    ReceivedOrders: ReceivedOrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const UserProfileNavigator = createStackNavigator(
  {
    Profile: UserProfileScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-person" : "ios-person"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const ChefProfileNavigator = createStackNavigator(
  {
    Profile: ChefProfileScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-person" : "ios-person"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const LocationNavigator = createStackNavigator(
  {
    Adddress: LocationScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Entypo name={"address"} size={23} color={drawerConfig.tintColor} />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Profile: UserProfileNavigator,
    Orders: OrdersNavigator,
    Address: LocationNavigator,
    // UserName: 'Hello'
    // Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const [userName, setuserName] = useState("");
      const db = firebase.firestore();
      const dispatch = useDispatch();
      const ReduxCurrentUser = useSelector((state) => state.auth.userId);
      const getUserName = async () => {
        await db
          .collection("app-users")
          .doc(ReduxCurrentUser)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document recieved", doc.data());
              setuserName(doc.data().UserName);
            } else {
              console.log("no such doc bro");
            }
          })
          .catch((error) => {
            console.log("error agya!!!!!!!");
          });
      };
      useEffect(() => {
        getUserName();
      }, []);
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <View style={styles.UserNameHolder}>
              <Ionicons
                name={Platform.OS == "android" ? "md-person" : "ios-person"}
                size={25}
              />
              <Text style={styles.usertxt}>Welcome {userName}</Text>
            </View>
            <DrawerNavigatorItems {...props} />

            <View style={styles.button}>
              <View style={styles.logout}>
                <Button
                  title="Logout"
                  color="white"
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate("Auth");
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    },
  }
);

const ChefShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    AddProducts: AdminNavigator,
    Profile: ChefProfileNavigator,
    ReceivedOrders: ReceivedOrdersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerNavigatorItems {...props} />

            <View style={styles.button}>
              <View style={styles.logout}>
                <Button
                  title="Logout"
                  color="white"
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate("Auth");
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Splash: SplashScreen,
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const ChefAuthNavigator = createStackNavigator(
  {
    // Splash: SplashScreen,
    ChefAuth: ChefAuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  StartUp: StartupScreen,
  Splash: SplashScreen,
  Auth: AuthNavigator,
  ChefAuth: ChefAuthNavigator,
  Shop: ShopNavigator,
  Chef: ChefShopNavigator,
});

const styles = StyleSheet.create({
  button: {
    paddingTop: 390,
  },
  chef: {
    borderColor: Colors.primary,
    borderWidth: 1,
    margin: 10,
  },
  logout: {
    backgroundColor: Colors.primary,
    margin: 10,
  },
  UserNameHolder: {
    paddingTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  usertxt: {
    marginLeft: 10,
    fontSize: 20,
  },
});

export default createAppContainer(MainNavigator);

import React from "react";
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
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import SplashScreen from "../screens/SplashScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/chef/EditProductScreen";
import Colors from "../constants/Colors";
import AuthScreen from "../screens/user/AuthScreen";
import ChefAuthScreen from "../screens/chef/ChefAuthScreen";
import StartupScreen from "../screens/StartupScreen";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import LocationScreen from "../screens/user/LocationScreen";

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

const LocationNavigator = createStackNavigator(
  {
    Address: LocationScreen,
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
    Orders: OrdersNavigator,
    Address: LocationNavigator,
    // Admin: AdminNavigator,
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
            <Image
              source={require("../assets/Omer.png")}
              style={{ width: 150, height: 100 }}
            />
            <DrawerNavigatorItems {...props} />

            <View style={styles.button}>
              <View style={styles.chef}>
                <Button
                  title="Can You Cook?"
                  color={Colors.primary}
                  onPress={() => {
                    props.navigation.navigate("ChefAuth");
                  }}
                />
              </View>
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
    Admin: AdminNavigator,
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
            {/* <Image
              source={require("../assets/Omer.png")}
              style={{ width: 250, height: 200, marginLeft: 5 }}
            /> */}
            <DrawerNavigatorItems {...props} />

            <View style={styles.chefButton}>
              {/* <View style={styles.chef}>
                <Button
                  title="Can You Cook?"
                  color={Colors.primary}
                  onPress={() => {
                    props.navigation.navigate("ChefAuth");
                  }}
                />
              </View> */}
              <View style={styles.chefLogout}>
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
    paddingTop: 350,
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
  chefLogout: {
    backgroundColor: Colors.primary,
    margin: 10,
  },
  chefButton: {
    paddingTop: 550,
  },
});

export default createAppContainer(MainNavigator);

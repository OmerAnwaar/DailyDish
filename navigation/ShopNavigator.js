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
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

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
  Alert,
  ScrollView,
} from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";
import ignoreWarnings from "react-native-ignore-warnings";

import SplashScreen from "../screens/SplashScreen";
import StartupScreen from "../screens/StartupScreen";

import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import CategoryDisplay from "../screens/shop/CategoryDisplay";
import RiderAuthScreen from "../screens/shop/RiderAuthScreen";
import RiderHomeScreen from "../screens/shop/RiderHomeScreen";
import RiderOrderScreen from "../screens/shop/RiderOrderScreen";
import SentOrdersScreen from "../screens/shop/SentOrdersScreen";
import CategoriesScreen from "../screens/shop/CategoriesScreen";
import AllProductsScreen from "../screens/shop/AllProductsScreen";
import RiderProfileScreen from "../screens/shop/RiderProfileScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
// import CategorizedProductsScreen from "../screens/shop/CategorizedProductsScreen";

import ChefAuthScreen from "../screens/chef/ChefAuthScreen";
import EditProductScreen from "../screens/chef/EditProductScreen";
import ChefProfileScreen from "../screens/chef/ChefProfileScreen";
import ChefLocationScreen from "../screens/chef/ChefLocationScreen";
import ReceivedOrdersScreen from "../screens/chef/ReceivedOrdersScreen";
import ChefProductOverviewScreen from "../screens/chef/ChefProductOverviewScreen";

import AuthScreen from "../screens/user/AuthScreen";
import LocationScreen from "../screens/user/LocationScreen";
import FavoritesScreen from "../screens/user/FavoritesScreen";
import UserProfileScreen from "../screens/user/UserProfileScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";

import Colors from "../constants/Colors";
import { db } from "../firebase/Firebase";
import UserName from "../screens/user/UserName";
import * as authActions from "../store/actions/auth";
import * as chefauth from "../store/actions/authChef";
import VoucherScreen from "../screens/shop/VoucherScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
    // fontSize: "17",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    AllProd: AllProductsScreen,
    CatDisplay: CategoryDisplay,
    Cart: CartScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);
const ChefProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ChefProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    AllProd: AllProductsScreen,
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
          name={Platform.OS === "android" ? "md-clock" : "ios-clock"}
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
const VoucherNavigator = createStackNavigator(
  {
    Vouchers: VoucherScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-gift" : "ios-gift"}
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

const CategoriesNavigator = createStackNavigator(
  {
    Categories: CategoriesScreen,
    CatDisplay: CategoryDisplay,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-browsers" : "ios-browsers"}
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

const ChefLocationNavigator = createStackNavigator(
  {
    Address: ChefLocationScreen,
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
const RiderHomeNavigator = createStackNavigator(
  {
    RiderHome: RiderHomeScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-home" : "ios-home"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const RiderProfileNavigator = createStackNavigator(
  {
    RiderProfile: RiderProfileScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-contact" : "ios-contact"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);
const RiderOrdersNavigator = createStackNavigator(
  {
    RiderOrder: RiderOrderScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={
            Platform.OS === "android"
              ? "md-checkmark-circle"
              : "ios-checkmark-circle"
          }
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const FavNavigator = createStackNavigator(
  {
    Favorites: FavoritesScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const tabScreenConfig = {
  Products: {
    // screen: ShopNavigator,
    screen: ProductsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="ios-restaurant" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary,
      tabBarLabel:
        Platform.OS === "android" ? (
          <Text style={{ fontFamily: "open-sans-bold" }}>Meals</Text>
        ) : (
          "Meals"
        ),
    },
  },
  Favorites: {
    screen: FavNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.accent,
      tabBarLabel:
        Platform.OS === "android" ? (
          <Text style={{ fontFamily: "open-sans-bold" }}>Favorites</Text>
        ) : (
          "Favorites"
        ),
    },
  },
};

const MealsFavTabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: "white",
        shifting: true,
        barStyle: {
          backgroundColor: Colors.primary,
        },
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          labelStyle: {
            fontFamily: "open-sans",
          },
          activeTintColor: Colors.primary,
        },
        navigationOptions: {
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={drawerConfig.tintColor}
            />
          ),
        },
      });

const ShopNavigator = createDrawerNavigator(
  {
    Products: MealsFavTabNavigator,
    // Products: ProductsNavigator,
    Profile: UserProfileNavigator,
    Orders: OrdersNavigator,
    Address: LocationNavigator,
    Categories: CategoriesNavigator,
    InProgress: SentOrdersNavigator,
    Vouchers: VoucherNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const [userName, setuserName] = useState("");
      const db = firebase.firestore();
      const dispatch = useDispatch();
      ignoreWarnings("Possible Unhandled Promise");
      const ReduxCurrentUser = useSelector((state) => state.auth.userId);

      const getUserName = async () => {
        let userNameRef = db.collection("app-users").doc(ReduxCurrentUser);
        let userNameGetter = await userNameRef.get();
        setuserName(userNameGetter.data().UserName);
        {
          console.log("i am running========>", userNameGetter.data());
        }
      };
      getUserName();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <View style={styles.UserNameHolder}>
                <Ionicons
                  name={Platform.OS == "android" ? "md-person" : "ios-person"}
                  size={25}
                  color={Colors.primary}
                />
                <Text style={styles.usertxt}>Welcome {userName}</Text>
                <UserName />
              </View>
              <DrawerNavigatorItems {...props} />
            </SafeAreaView>

            <View style={styles.buttonUser}>
              <View style={styles.logout}>
                <Button
                  title="Logout"
                  color={Platform.OS === "android" ? Colors.primary : "white"}
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate("Auth");
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      );
    },
  }
);

const ChefShopNavigator = createDrawerNavigator(
  {
    Products: ChefProductsNavigator,
    AddProducts: AdminNavigator,
    Profile: ChefProfileNavigator,
    Address: ChefLocationNavigator,
    ReceivedOrders: ReceivedOrdersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const [userName, setuserName] = useState("");
      const [ChefStatus, setChefStatus] = useState(false);
      const dispatch = useDispatch();
      const db = firebase.firestore();
      const ReduxCurrentUser = useSelector((state) => state.authChef.userId);
      const [chefCnic, setchefCnic] = useState("");
      ignoreWarnings("Possible Unhandled Promise");

      const CheckChef = async () => {
        let checkChefRef = db.collection("app-users").doc(ReduxCurrentUser);
        let statusGetter = await checkChefRef.get();
        //setChefStatus( statusGetter.data().chefStatus)
        let chefStat = statusGetter.data().chefStatus;
        console.log("Ye status mila hai", chefStat);
        if (chefStat === false) {
          Alert.alert("Sign Up as a Chef!");
          dispatch(chefauth.logout());
          props.navigation.navigate("Auth");
        }
      };
      setTimeout(function () {
        CheckChef();
      }, 5000);
      // const currAddrChecker = async () => {
      //   let refAdd = db.collection("chefs").doc(ReduxCurrentUser);
      //   let Add = await refAdd.get();
      //   console.log("Oh hellllo payen", Add.data());
      //   let currAddSetter = Add.data().CurrentAddress
      //   console.log("Ye curraddress mila hai", currAddSetter);
      //   if (currAddSetter === "notset") {
      //     Alert.alert("Set Your Address", "Please Set a current Address!");
      //     props.navigation.navigate("Address")
      //   }
      // };
      // setTimeout(function () {
      //   currAddrChecker();
      // }, 6000);
      const getUserName = async () => {
        let userNameRef = db.collection("chefs").doc(ReduxCurrentUser);
        let userNameGetter = await userNameRef.get();
        setuserName(userNameGetter.data().ChefName);
      };
      getUserName();

      ignoreWarnings("Possible Unhandled Promise");
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <View style={styles.UserNameHolder}>
                <Ionicons
                  name={Platform.OS == "android" ? "md-person" : "ios-person"}
                  size={25}
                  color={Colors.primary}
                />
                <Text style={styles.usertxt}>Welcome {userName}</Text>
                <UserName />
              </View>
              <DrawerNavigatorItems {...props} />
            </SafeAreaView>
            <View style={styles.buttonUser}>
              <View style={styles.logout}>
                <Button
                  title="Logout"
                  color={Platform.OS === "android" ? Colors.primary : "white"}
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate("Auth");
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      );
    },
  }
);
const RiderNavigator = createDrawerNavigator(
  {
    Home: RiderHomeNavigator,
    Profile: RiderProfileNavigator,
    CompletedOrders: RiderOrdersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const [userName, setuserName] = useState("");
      const dispatch = useDispatch();
      const db = firebase.firestore();
      const ReduxCurrentUser = useSelector((state) => state.authRider.userId);
      const getUserName = async () => {
        let userNameRef = db.collection("riders").doc(ReduxCurrentUser);
        let userNameGetter = await userNameRef.get();
        setuserName(userNameGetter.data().UserName);
      };
      getUserName();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <View style={styles.UserNameHolder}>
                <Ionicons
                  name={Platform.OS == "android" ? "md-person" : "ios-person"}
                  size={25}
                  color={Colors.primary}
                />
                <Text style={styles.usertxt}>Welcome {userName}</Text>
                <UserName />
              </View>
              <DrawerNavigatorItems {...props} />
            </SafeAreaView>
            <View style={styles.buttonUser}>
              <View style={styles.logout}>
                <Button
                  title="Logout"
                  color={Platform.OS === "android" ? Colors.primary : "white"}
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate("Auth");
                  }}
                />
              </View>
            </View>
          </ScrollView>
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
const RiderAuthNavigator = createStackNavigator(
  {
    RiderAuth: RiderAuthScreen,
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
  SentOrders: SentOrdersNavigator,
  RiderAuth: RiderAuthNavigator,
  Rider: RiderNavigator,
  chefAddress: ChefLocationNavigator,
});

const styles = StyleSheet.create({
  buttonUser: {
    // position: "absolute",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // bottom: 0,
  },
  buttonChef: {
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
    bottom: "220%"
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
    color: Colors.primary,
    marginLeft: 10,
    fontSize: 20,
  },
  buttonRider: {
    paddingTop: 430,
  },
});

export default createAppContainer(MainNavigator);
// export default createAppContainer(RiderNavigator);

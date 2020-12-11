import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";

import productsReducer from "./store/reducers/products";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import cartReducer from "./store/reducers/cart";
import CordinateReducer from "./store/reducers/cordinates";
import authChefReducer from "./store/reducers/authChef";
import ignoreWarnings from 'react-native-ignore-warnings';

import NavigationContainer from "./navigation/NavigationContainer";
import theContext from "./components/categories/theContext";

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
  authChef: authChefReducer,
  cord: CordinateReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
 
  ignoreWarnings('Setting a timer');
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./ShopNavigator";
import theContext from "../components/categories/theContext";

const NavigationContainer = (props) => {
  const { Provider } = theContext;
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);
  const [CatProvide, setCatProvide] = useState("");

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);

  return (
    <Provider value={{ CatProvide, setCatProvide }}>
      <ShopNavigator ref={navRef} />
    </Provider>
  );
};

export default NavigationContainer;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cart";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

const AllProductsScreen = (props) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.availableProducts);
  const ownerId = props.navigation.getParam("ownerId");
  // const kitchenName = props.navigation.getParam("kitchenName");

  const selectItemHandler = (id, title, ownerId) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
      ownerId: ownerId,
    });
  };
  let chefProducts = products.filter((pArr) => pArr.ownerId === ownerId);
  console.log("i am here bro!", chefProducts);
  return (
    <View style={styles.screen}>
      <FlatList
        data={chefProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            kitchenName={itemData.item.kitchenName}
            productID={itemData.item.id}
            ownerId={itemData.item.ownerId}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.title,
                itemData.item.ownerId,
                itemData.item.kitchenName
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
    </View>
  );
};
AllProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("kitchenName"),
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
  screen: {
    flex: 1,
  },
  // hello: {
  //   justifyContent: "center",
  //   textAlign: "center",
  //   paddingTop: 30,
  // },
  // saad: {
  //   textAlign: "center",
  //   paddingTop: 300,
  // },
  // centered: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // flatList: {
  //   paddingLeft: 15,
  //   marginTop: 15,
  //   paddingBottom: 15,
  //   fontSize: 20,
  //   borderBottomColor: "#26a69a",
  //   borderBottomWidth: 1,
  // },
  // title: {
  //   textAlign: "center",
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   justifyContent: "center",
  //   marginTop: "2%",
  //   color: "#95a5a6",
  // },
});

export default AllProductsScreen;

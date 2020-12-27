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
import ignoreWarnings from 'react-native-ignore-warnings';
import {db} from "../../firebase/Firebase"

const UserProductsScreen = (props) => {
 
  const userProducts = useSelector((state) => state.chefproducts.userProducts);
  const dispatch = useDispatch();
  ignoreWarnings('Each child in');
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
        <Ionicons style={styles.refresh} name={Platform.OS === "android" ? "md-refresh" : "ios-refresh"}
              size={25} onPress={()=>{
                dispatch(productsActions.fetchProducts())
              }} ></Ionicons>
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
  refresh:{
    alignSelf: 'flex-end'
  }
});

export default UserProductsScreen;

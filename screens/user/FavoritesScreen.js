import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase/Firebase";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";

import HeaderButton from "../../components/UI/HeaderButton";

const FavoritesScreen = (props) => {
  const dispatch = useDispatch();
  const [favFood, setfavFood] = useState([]);
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const fetchFvourites = async () => {
    let favref = db
      .collection("app-users")
      .doc(ReduxCurrentUser)
      .collection("favourite").orderBy("timestamp","desc")
    await favref.get().then((res) => {
      setfavFood(
        res.docs.map((doc) => ({
          id: doc.id,
          KitchenName: doc.data().KitchenName,
          ownerId: doc.data().ownerId,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
          price: doc.data().price,
          title: doc.data().title,
        
        }))
      );
    });

    favFood.map((doc) => {
      console.log("i am mapped", doc.title);
    });

    //  favref.onSnapshot((res) => {
    //     res.docs.map((doc) => {
    //       console.log("data", doc.data());
    //     });
    //   });
  };
  // useEffect(() => {
  //   fetchFvourites();
  // }, []);

  const selectItemHandler = (id, title, ownerId) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
      ownerId: ownerId,
    });
  };
  useEffect(() => {
    fetchFvourites();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      fetchFvourites();
      console.log("focussed");
    });
    return () => {
      unsubscribe.remove();
    };
  }, []);
  return (
    <View>
      {favFood.length == null ? (
        <View style={styles.content}>
          <Text>No favorite meals found. Start adding some!  </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View >
            <Text style={styles.title}>Your Favourite Food!</Text>
          </View>
          <FlatList
            data={favFood}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                kitchenName={itemData.item.KitchenName}
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
                  title="View Details"
                  onPress={() => {
                    selectItemHandler(
                      itemData.item.id,
                      itemData.item.title,
                      itemData.item.ownerId
                    );
                  }}
                />
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
      )}
    </View>
  );
};

FavoritesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Favorites",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container:{
marginBottom: "19%"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title:{
   fontSize: 20,
   textAlign: "center",
   padding: "2%"
  }
});

export default FavoritesScreen;

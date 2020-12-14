import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from "react-native";
import Colors from '../../constants/Colors'
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase/Firebase";
import OrderItem from '../../components/shop/OrderItem'
const SentOrdersScreen = () => {
  const [orderHolder, setorderHolder] = useState([]);
  
  const [OrderTime, setOrderTime] = useState("");
  const [loading, setloading] = useState(false)
  const ReduxCurrentUser = useSelector((state) => state.auth.userId);
  const orders = useSelector((state) => state.orders.orders);
  // useEffect(async() => {
  //   setloading(true)
  //  await getteOrderRecipt();
  //   setloading(false)
  //   return () => {
  //     getteOrderRecipt();
  //   };
  // }, []);
  // const getteOrderRecipt = async () => {
  //   const orderReciptRef = db
  //     .collection("orders")
  //     .where("Customer", "==", ReduxCurrentUser)
  //     .where("orderStatus", "==", "requested");
  //    await orderReciptRef.get().then(res=>{
  //    setorderHolder(
  //     res.docs.map(doc=>({
  //       kitchenName: doc.data().kitchenName,
  //         deliveryStatus: doc.data().deliverystatus,
  //         orderStatus: doc.data().orderStatus,
  //         productPrice: doc.data().productPrice,
  //         sum: doc.data().sum,
  //         quantity: doc.data().quantity,
  //     })))
  //   })

  //   // await orderReciptRef.onSnapshot(snap=>{
  //   //   setorderHolder(
  //   //     snap.docs.map(doc=>({
  //   //       kitchenName: doc.data().kitchenName,
  //   //       deliveryStatus: doc.data().deliverystatus,
  //   //       orderStatus: doc.data().orderStatus,
  //   //       productPrice: doc.data().productPrice,
  //   //       sum: doc.data().sum,
  //   //       quantity: doc.data().quantity,
  //   //     }))
  //   //   )
  //   // })

  //   // setorderHolder(
  //   //   orderRecipt.docs.map((doc) => ({
  //   //     kitchenName: doc.data().kitchenName,
  //   //     deliveryStatus: doc.data().deliverystatus,
  //   //     orderStatus: doc.data().orderStatus,
  //   //     productPrice: doc.data().productPrice,
  //   //     sum: doc.data().sum,
  //   //     quantity: doc.data().quantity,
  //   //   }))
  //   // );
  //   console.log("i am set",orderHolder)
 
  // };
  // getteOrderRecipt()


  //console.log("i am the order bro============================>", orders);
  // {
  //   orders.orders.map((order) => {
  //     console.log("ethae aaa", order.items);
  //   });
  // }

  return (
    <View style={styles.screen}>
      <View style={styles.recipt}>
      <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
      </View>
    </View>
  );
};

SentOrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Order",
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
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  recipt: {
    flexGrow: 1,
    height: "80%",
    width: "90%",
    backgroundColor: "#ced6e0",
  },
});

export default SentOrdersScreen;

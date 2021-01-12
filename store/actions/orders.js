import Order from "../../models/order";
import { db } from "../../firebase/Firebase";
import cart from "../reducers/cart";
import * as firebase from "firebase";
import "firebase/firestore";
export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-shopping-3e552.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const loadedOrders = [];
      const getOrders = db
        .collection("orders")
        .where("Customer", "==", userId)
        .where("orderStats", "==", "requested");
      const order = await getOrders.get();
      for (const doc in order.docs) {
        loadedOrders.push(new Order(doc.id));
      }

      const resData = await response.json();

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  console.log("hello");
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    // const response = await fetch(
    //   `https://rn-shopping-3e552.firebaseio.com/orders/${userId}.json?auth=${token}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       cartItems,
    //       totalAmount,
    //       date: date.toISOString(),
    //     }),
    //   }
    // );
    // if (!response.ok) {
    //   throw new Error("Something went wrong!");
    // }
    console.log("yahan tak tou aya=======>", userId);
let ownerID = ""
cartItems.map(doc=>{
  ownerID = doc.ownerId
})
    const gettingUserInfoRef = db.collection("app-users").doc(userId);
    const gettingUserInfo = await gettingUserInfoRef.get();
    const CurrAdress = gettingUserInfo.data().CurrentAddress;
    const phnumber = gettingUserInfo.data().phnumber;
    const UserName = gettingUserInfo.data().UserName;
    console.log("Ye hain cart items========>", cartItems, totalAmount);
    
    const presetterRef = await db.collection("orders").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        kitchenRated: false,
        orderStatus: "requested",
        deliverystatus: "requested",
        CurrentAddress: CurrAdress,
        CustomerId: userId,
        phnumber: phnumber,
        CustomerName: UserName,
        totalAmount: totalAmount,
        ownerId: ownerID
      })
     const docID =  presetterRef.id

  console.log("yeh hai docref=========>", docID)

    const ordersetterref= db.collection("orders").doc(docID)
    cartItems.map( async (items)=>{
      await ordersetterref.update({
        items:firebase.firestore.FieldValue.arrayUnion({
            kitchenName: items.kitchenName,
            ownerId: items.ownerId,
            productId: items.productId,
            productPrice: items.productPrice,
            productTitle: items.productTitle,
            quantity: items.quantity,
            sum: items.sum,

        })
      })
    })

    // cartItems.map(async (items) => {
    //   const ordersetterRef = db
    //     .collection("app-users")
    //     .doc(userId)
    //     .collection("orders-history")
    //     .doc();

    //   await ordersetterRef.set({
    //     kitchenName: items.kitchenName,
    //     ownerId: items.ownerId,
    //     productPrice: items.productPrice,
    //     id: items.productId,
    //     productTitle: items.productTitle,
    //     quantity: items.quantity,
    //     sum: items.sum,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     orderStatus: "requested",
    //     deliverystatus: "requested",
    //     CurrentAddress: CurrAdress,
    //     phnumber: phnumber,
    //     CustomerName: UserName,
    //   });
    // });
    // cartItems.map(async (items) => {
    //   const ordersetterRef = db.collection("orders").doc();

    //   await ordersetterRef.set({
    //     kitchenName: items.kitchenName,
    //     ownerId: items.ownerId,
    //     productPrice: items.productPrice,
    //     id: items.productId,
    //     productTitle: items.productTitle,
    //     quantity: items.quantity,
    //     sum: items.sum,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     orderStatus: "requested",
    //     deliverystatus: "requested",
    //     CurrentAddress: CurrAdress,
    //     phnumber: phnumber,
    //     CustomerName: UserName,
    //     Customer: userId
    //   });
    // });
    // cartItems.map((items) => {
    //   console.log("Items info", items);
    // });

    // await db
    //   .collection("app-users")
    //   .doc(userId)
    //   .collection("orders-history")
    //   .doc()
    //   .set({
    //     // orderItems: [
    //     //   {
    //     //     productId: cartItems.productId,
    //     //     productPrice: cartItems.productPrice,
    //     //     productTitle: cartItems.productTitle,
    //     //     quantity: cartItems.quantity,
    //     //     productPrice: cartItems.sum,
    //     //   },
    //     // ],
    // orderItems:firebase.firestore.FieldValue.arrayUnion({
    //   hello: "saad"
    // }),
    //     // totalAmount: totalAmount,
    //     // date: db.FieldValue.serverTimestamp(),
    //     // test:"test"
    //  });

    // await orderAddref.set({
    //   cartitems: cartItems,
    //   totalAmount: totalAmount,
    //   kitchenName: kitchenName,
    //   date: date.toISOString(),
    // }).catch(error=>{
    //   console.log(error)
    // })

    // const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: cartItems.key,
        items: cartItems,
        amount: totalAmount,
        date: date,
        kitchenName: cartItems.kitchenName,
      },
    });
  };
};

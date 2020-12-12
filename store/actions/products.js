import Product from "../../models/product";
import * as firebase from "firebase";
import "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { Children } from "react";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
//const db = firebase.firestore();

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      // const response = await fetch(
      //   "https://rn-shopping-3e552.firebaseio.com/products.json"
      // );

      // if (!response.ok) {
      //   throw new Error("Something went wrong!");
      // }
      const pArr = [];
      const getProducts = async () => {
        let productref = db.collection("products-view");
        let allProducts = await productref.orderBy("timestamp", "desc").get();
        for (const doc of allProducts.docs) {
          pArr.push(
            new Product(
              doc.id,
              doc.data().ownerId,
              doc.data().title,
              doc.data().KitchenName,
              doc.data().imageUrl,
              doc.data().description,
              Number.parseInt(doc.data().price),
              doc.data().timestamp.toDate().toString().slice(0, 21),
              doc.data().category
            )
          );
        }

        console.log("user id", userId);
        pArr.map((item) => {
          console.log("owner id", item);
        });
        dispatch({
          type: SET_PRODUCTS,
          products: pArr,
          userProducts: pArr.filter((pArr) => pArr.ownerId === userId),
        });
      };

      getProducts().catch((error) => {
        console.log(error);
      });
      // logproducts();
      // const pArr = [];
      // const tofire = await db.collection("products-view").onSnapshot(
      //   (snap) => {

      //     snap.docs.map((doc) =>
      //       pArr.push(
      //         new Product(
      //           doc.id,
      //           doc.data().ownerId,
      //           doc.data().title,
      //           doc.data().KitchenName,
      //           doc.data().imageUrl,
      //           doc.data().description,
      //           doc.data().price
      //         )
      //       )
      //     );
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );

      // const resData = await response.json();
      // const loadedProducts = [];
      // console.log("i am the key babe", resData.key);
      // for (const key in resData) {
      //   loadedProducts.push(
      //     new Product(
      //       key,
      //       resData[key].ownerId,
      //       resData[key].title,
      //       resData[key].imageUrl,
      //       resData[key].description,
      //       resData[key].price
      //     )
      //   );
      // }
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-3e552.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (
  title,
  description,
  imageUrl,
  price,
  category
) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    // const response = await fetch(
    //   `https://rn-shopping-3e552.firebaseio.com/products.json?auth=${token}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       title,
    //       description,
    //       imageUrl,
    //       price,
    //       ownerId: userId,
    //     }),
    //   }
    // );

    //const resData = await response.json();

    let kitchenNameRef = db.collection("chefs").doc(userId);
    let kitchennameExtractor = await kitchenNameRef.get();
    console.log(kitchennameExtractor)
    const kName = kitchennameExtractor.data().KitchenName;
    console.log("kitchen name =====>>>", kName);

    let ProductViewRef = db.collection("products-view").doc();
    const res = await ProductViewRef.set({
      KitchenName: kName,
      category: category,
      description: description,
      imageUrl: imageUrl,
      ownerId: userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      title: title,
      price: price
    });
    let docID = 0;
    let docIdRef = db.collection("products-view");
    let docId = await docIdRef.where("description", "==", description).get();
    docId.docs.map((doc) => {
      console.log("doc=====>", doc.data());
      docID = doc.data().id;
    });
    console.log("doc id ye set ki hai ======>", docID);

  
    const intNumber = Number.parseInt(price);
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: docID,
        title,
        description,
        imageUrl,
        intNumber,
        ownerId: userId,
        category,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-3e552.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};

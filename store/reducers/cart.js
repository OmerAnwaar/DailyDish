import { ADD_TO_CART, REMOVE_FROM_CART, ADD_QUANT } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import CartItem from "../../models/cart-item";
import { DELETE_PRODUCT } from "../actions/products";
import { Alert } from "react-native";
import { add } from "react-native-reanimated";
const initialState = {
  items: {},
  totalAmount: 0,
  ownerId: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      const kitchenName = addedProduct.kitchenName;
      const ownerId = addedProduct.ownerId;
      const id = addedProduct.id;
      console.log("added product", addedProduct);
      console.log("Added product ownerid", addedProduct.ownerId);
      console.log("onwer dekhna", state.ownerId);
      console.log("price", prodPrice);
      console.log("i am the state", state);

      let updatedOrNewCartItem;
      if (state.ownerId != "" && state.ownerId != addedProduct.ownerId) {
        Alert.alert(
          "At this time we don't allow Multiple Kitchen in Single Order"
        );
        return {
          ...state,
          totalAmount: state.totalAmount,
          ownerId: state.ownerId,
        };
      } else if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          id,
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice,
          ownerId,
          kitchenName
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + prodPrice,
          ownerId: addedProduct.ownerId,
        };
      } else {
        updatedOrNewCartItem = new CartItem(
          id,
          1,
          prodPrice,
          prodTitle,
          prodPrice,
          ownerId,
          kitchenName
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
          totalAmount: state.totalAmount + prodPrice,
          ownerId: addedProduct.ownerId,
        };
      }

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid];
      const currentQty = selectedCartItem.quantity;
      const currenOwnerId = state.ownerId;
      let updatedCartItems;
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.id,
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        state.ownerId = "";
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
    case ADD_QUANT:
      const addedquant = action.product;
      const quantPrice = addedquant.productPrice;
      const quantTitle = addedquant.productTitle;
      const kName = addedquant.kitchenName;
      const oId = addedquant.ownerId;
      const uid = addedquant.id;
      console.log("i am added quantatiy", addedquant);
      console.log("Added product ownerid", addedquant.ownerId);
      console.log("onwer dekhna", state.ownerId);
      console.log("price", quantPrice);
      console.log("i am the state", state);
      let updatedCartItem;
      if (state.items[addedquant.productId]) {
        // already have the item in the cart
        updatedCartItem = new CartItem(
          uid,
          state.items[addedquant.productId].quantity + 1,
          quantPrice,
          quantTitle,
          state.items[addedquant.productId].sum + quantPrice,
          oId,
          kName
        );
        return {
          ...state,
          items: { ...state.items, [addedquant.productId]: updatedCartItem },
          totalAmount: state.totalAmount + quantPrice,
          ownerId: addedquant.ownerId,
        };
      }
  }

  return state;
};

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
      // state.cart = state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter(
        (cartItem) => cartItem.pizzaId !== action.payload,
      );
    },
    increaseItemQuantity(state, action) {
      // pizzaId and quantity will be increased
      const item = state.cart.find(
        (cartItem) => cartItem.pizzaId === action.payload,
      );
      item.quantity++;
      item.totalPrice = item.unitPrice * item.quantity;
      // state.cart = { ...state.cart, item };
    },
    decreaseItemQuantity(state, action) {
      // pizzaId and quantity will be increased

      const item = state.cart.find(
        (cartItem) => cartItem.pizzaId === action.payload,
      );
      item.quantity--;
      item.totalPrice = item.unitPrice * item.quantity;
      if (item.quantity === 0)
        cartSlice.caseReducers(deleteItem(state, action));
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((prev, cur) => prev + cur.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((prev, cur) => prev + cur.totalPrice, 0);

export const getCart = (state) => state.cart.cart;

export const getPizzaQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;

// function getPizzaQuantity(id) {
//   return (state) =>
//     state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
// }

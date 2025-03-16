import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    selectedItems: 0,
    totalPrice: 0,
    tax: 0,
    taxRate: 0.05,
    grandTotal: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
           

            const isExists = state.products.find((item) => item._id === product._id);
            if (!isExists) {
                state.products.push({ ...product, quantity: 1 });
                
            } else {
              
                // If the product already exists, increment the quantity
                isExists.quantity += 1;
            }

            // Update the cart totals
            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.tax = setTax(state);
            state.grandTotal = setGrandTotal(state);
        },
        updateQuantity: (state, action) => {
            const { type, id } = action.payload;
            const product = state.products.find((item) => item._id === id);

            if (product) {
                
                if (type === 'increment') {
                    product.quantity += 1;
                } else if (type === 'decrement' && product.quantity > 1) {
                    product.quantity -= 1;
                }
            }

            // Update the cart totals
            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.tax = setTax(state);
            state.grandTotal = setGrandTotal(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload.id;
          
            state.products = state.products.filter((product) => product._id !== id);

            // Update the cart totals
            state.selectedItems = setSelectedItems(state);
            state.totalPrice = setTotalPrice(state);
            state.tax = setTax(state);
            state.grandTotal = setGrandTotal(state);
        },
        clearCart: (state) => {
            state.products = [];
            state.selectedItems = 0;
            state.totalPrice = 0;
            state.tax = 0;
            state.grandTotal = 0;
        }
    },
});

export const setSelectedItems = (state) => state.products.reduce((total, product) => total + product.quantity, 0);
export const setTotalPrice = (state) => state.products.reduce((total, product) => total + product.quantity * product.price, 0);
export const setTax = (state) => setTotalPrice(state) * state.taxRate;
export const setGrandTotal = (state) => setTotalPrice(state) + setTotalPrice(state) * state.taxRate;

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

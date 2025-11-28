import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const initialState = {
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload || [] };
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + action.payload.quantity, 99),
                }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i._id !== action.payload),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.id
            ? { ...i, quantity: action.payload.qty }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = useContext(AuthContext);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweetshop_cart");
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch (e) {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("sweetshop_cart", JSON.stringify(state.items));
    } catch (e) {
      // ignore
    }
  }, [state.items]);

  const addItem = (item) => {
    const payload = { ...item, quantity: item.quantity || 1 };
    dispatch({ type: "ADD_ITEM", payload });
    if (token) {
      const id = payload._id || payload.sweetId || payload.id;
      axios
        .post(
          "/api/cart/item",
          { id, quantity: payload.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch(() => {});
    }
  };

  const hydrate = (items) => dispatch({ type: "HYDRATE", payload: items });

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    if (token) {
      axios
        .delete(`/api/cart/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(() => {});
    }
  };

  const updateQty = (id, qty) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
    if (token) {
      axios
        .post(
          "/api/cart/item",
          { id, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch(() => {});
    }
  };

  const clear = () => {
    dispatch({ type: "CLEAR" });
    if (token) {
      axios
        .delete("/api/cart", { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {});
    }
  };

  const count = state.items.reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQty,
        clear,
        count,
        hydrate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

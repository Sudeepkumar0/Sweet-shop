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

  // Hydrate cart from DB when user logs in or token changes
  useEffect(() => {
    if (!token) {
      // No token = not logged in, clear cart
      dispatch({ type: "HYDRATE", payload: [] });
      return;
    }

    // Fetch cart from DB for authenticated user
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = (res.data || []).map((it) => ({
          ...it,
          _id: it._id || it.sweetId || it.id,
        }));
        dispatch({ type: "HYDRATE", payload: items });
      } catch (err) {
        console.error("Failed to fetch cart from database:", err.message);
        dispatch({ type: "HYDRATE", payload: [] });
      }
    };

    fetchCart();
  }, [token]);

  const addItem = (item) => {
    if (!token) {
      console.warn("User must be logged in to add items to cart");
      return false;
    }

    const payload = { ...item, quantity: item.quantity || 1 };
    const id = payload._id || payload.sweetId || payload.id;

    // Optimistic update (add to UI immediately)
    dispatch({ type: "ADD_ITEM", payload });

    // Sync to DB
    axios
      .post(
        "/api/cart/item",
        { id, quantity: payload.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // Hydrate from server response to keep in sync
        const items = (res.data || []).map((it) => ({
          ...it,
          _id: it._id || it.sweetId || it.id,
        }));
        dispatch({ type: "HYDRATE", payload: items });
      })
      .catch((err) => {
        console.error("Failed to add item to database cart:", err.message);
      });

    return true;
  };

  const removeItem = (id) => {
    if (!token) {
      console.warn("User must be logged in to remove items from cart");
      return;
    }

    // Optimistic update
    dispatch({ type: "REMOVE_ITEM", payload: id });

    // Sync to DB
    axios
      .delete(`/api/cart/item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Hydrate from server response
        const items = (res.data || []).map((it) => ({
          ...it,
          _id: it._id || it.sweetId || it.id,
        }));
        dispatch({ type: "HYDRATE", payload: items });
      })
      .catch((err) => {
        console.error("Failed to remove item from database cart:", err.message);
      });
  };

  const updateQty = (id, qty) => {
    if (!token) {
      console.warn("User must be logged in to update cart");
      return;
    }

    // Optimistic update
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });

    // Sync to DB
    axios
      .post(
        "/api/cart/item",
        { id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // Hydrate from server response
        const items = (res.data || []).map((it) => ({
          ...it,
          _id: it._id || it.sweetId || it.id,
        }));
        dispatch({ type: "HYDRATE", payload: items });
      })
      .catch((err) => {
        console.error("Failed to update cart item quantity:", err.message);
      });
  };

  const clear = () => {
    if (!token) {
      console.warn("User must be logged in to clear cart");
      return;
    }

    // Optimistic update
    dispatch({ type: "CLEAR" });

    // Sync to DB
    axios
      .delete("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => {
        console.error("Failed to clear cart:", err.message);
      });
  };

  const hydrate = (items) => dispatch({ type: "HYDRATE", payload: items });

  // Cart count
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

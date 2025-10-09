import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const GUEST_CART_KEY = 'guest_cart_v1';

function readGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(Boolean);
  } catch (e) {
    console.warn('Failed to read guest cart:', e);
    return [];
  }
}

function writeGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items || []));
  } catch (e) {
    console.warn('Failed to write guest cart:', e);
  }
}

function upsertGuestItem(items, product, quantity) {
  const productId = product.id ?? product.productId;
  const idx = items.findIndex((it) => it.productId === productId);
  const base = {
    productId,
    name: product.name || '',
    price: product.price || 0,
    image: product.image || (Array.isArray(product.images) ? product.images[0] : ''),
  };
  if (idx >= 0) {
    const cur = items[idx];
    const updated = {
      ...cur,
      ...base,
      quantity: (cur.quantity || 0) + quantity,
    };
    items[idx] = updated;
  } else {
    items.push({ ...base, quantity });
  }
  return items;
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]); // unified items for UI
  const [loading, setLoading] = useState(true);
  const mergeRef = useRef(false);

  // Build a deterministic cart item document ID so we can upsert without extra queries
  const itemDocId = (uid, productId) => `${uid}_${String(productId)}`;

  // Mode: guest (localStorage) or authed (Firestore)
  const isGuest = !currentUser;

  // Initialize and subscribe depending on auth state
  useEffect(() => {
    if (isGuest) {
      // Guest mode: read from localStorage
      const local = readGuestCart();
      setItems(local);
      setLoading(false);
      return;
    }

    // Authenticated: subscribe to Firestore cart
    setLoading(true);
    const q = query(collection(db, 'cart'), where('userId', '==', currentUser.uid));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Normalize for UI: ensure productId present
        const normalized = list.map((it) => ({
          ...it,
          productId: it.productId ?? it.id?.split('_')?.slice(1).join('_'),
        }));
        setItems(normalized);
        setLoading(false);
      },
      (err) => {
        console.error('Cart subscription error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [isGuest, currentUser]);

  // Merge guest cart into Firestore on login
  useEffect(() => {
    async function mergeGuestIntoFirestore() {
      if (!currentUser) return;
      if (mergeRef.current) return; // prevent duplicate merges
      const guestItems = readGuestCart();
      if (!guestItems.length) return;
      mergeRef.current = true;
      try {
        for (const gi of guestItems) {
          const product = {
            id: gi.productId,
            name: gi.name,
            price: gi.price,
            image: gi.image,
          };
          await addToCartFirestore(product, gi.quantity || 1);
        }
        writeGuestCart([]); // clear guest cart after successful merge
      } catch (e) {
        console.error('Failed to merge guest cart:', e);
      } finally {
        mergeRef.current = false;
      }
    }

    mergeGuestIntoFirestore();
  }, [currentUser]);

  const totalCount = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 0) * (it.price || 0), 0),
    [items]
  );

  // Internal Firestore upsert
  async function addToCartFirestore(product, quantity = 1) {
    const uid = currentUser?.uid;
    if (!uid) throw new Error('AUTH_REQUIRED');
    if (!product || product.id == null) throw new Error('INVALID_PRODUCT');
    const id = itemDocId(uid, product.id);
    const ref = doc(db, 'cart', id);

    // Single write that works for both create and update without requiring a prior read
    await setDoc(
      ref,
      {
        userId: uid,
        productId: product.id,
        name: product.name || '',
        price: product.price || 0,
        image: product.image || (Array.isArray(product.images) ? product.images[0] : ''),
        quantity: increment(quantity),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  // Internal localStorage upsert
  function addToCartLocal(product, quantity = 1) {
    const current = readGuestCart();
    upsertGuestItem(current, product, quantity);
    writeGuestCart(current);
    setItems([...current]);
  }

  async function addToCart(product, quantity = 1) {
    if (!product || (product.id == null && product.productId == null)) {
      throw new Error('INVALID_PRODUCT');
    }
    if (quantity <= 0) return;
    if (isGuest) {
      addToCartLocal(product, quantity);
    } else {
      await addToCartFirestore(product, quantity);
    }
  }

  async function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) return removeFromCart(productId);

    if (isGuest) {
      const current = readGuestCart();
      const idx = current.findIndex((it) => it.productId === productId);
      if (idx >= 0) {
        current[idx] = { ...current[idx], quantity: newQuantity };
        writeGuestCart(current);
        setItems([...current]);
      }
      return;
    }

    const uid = currentUser.uid;
    const id = itemDocId(uid, productId);
    const ref = doc(db, 'cart', id);
    await updateDoc(ref, {
      quantity: newQuantity,
      updatedAt: serverTimestamp(),
    });
  }

  async function removeFromCart(productId) {
    if (isGuest) {
      const current = readGuestCart().filter((it) => it.productId !== productId);
      writeGuestCart(current);
      setItems([...current]);
      return;
    }

    const uid = currentUser.uid;
    const id = itemDocId(uid, productId);
    await deleteDoc(doc(db, 'cart', id));
  }

  async function clearCart() {
    if (isGuest) {
      writeGuestCart([]);
      setItems([]);
      return;
    }

    const uid = currentUser.uid;
    const q = query(collection(db, 'cart'), where('userId', '==', uid));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(doc(db, 'cart', d.id)));
    await batch.commit();
  }

  const value = {
    items,
    loading,
    totalCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isGuest,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

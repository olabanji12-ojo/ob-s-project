// src/utils/firestoreUtils.js
import {
    doc,
    getDoc,
    runTransaction,
    collection,
    setDoc,
    serverTimestamp,
    increment,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  
  /**
   * Retrieve a single product doc snapshot + data
   * @param {string} productId
   */
  export async function getProduct(productId) {
    const ref = doc(db, "products", productId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }
  
  /**
   * Check if every item in cart has enough stock.
   * items: [{ productId, quantity }]
   * returns: { ok: boolean, outOfStock: [{ productId, available, requested }...] }
   */
  export async function checkStockForCart(items = []) {
    const outOfStock = [];
  
    // fetch each product in parallel
    const promises = items.map(async (item) => {
      const product = await getProduct(item.productId);
      const available = product?.stock ?? 0;
      if (available < item.quantity) {
        outOfStock.push({
          productId: item.productId,
          available,
          requested: item.quantity,
          name: product?.name || null,
        });
      }
    });
  
    await Promise.all(promises);
  
    return { ok: outOfStock.length === 0, outOfStock };
  }
  
  /**
   * Create order and atomically decrement stock using a transaction.
   *
   * @param {object} params
   * @param {string} params.userId
   * @param {Array} params.items - [{ productId, quantity, price, name }]
   * @param {number} params.totalAmount - in Naira (or lowest currency unit; be consistent)
   * @param {object} params.paymentInfo - { reference, gateway_response, paid_at, raw } (from Paystack)
   *
   * Returns saved order object (orderId and docs).
   *
   * Throws if any product has insufficient stock or transaction fails.
   */
  export async function createOrderAndDecreaseStock({ userId, items, totalAmount, paymentInfo }) {
    // We use runTransaction to ensure atomicity and prevent race conditions.
    return await runTransaction(db, async (tx) => {
      // 1) Re-check stock for each product inside transaction
      for (const item of items) {
        const prodRef = doc(db, "products", item.productId);
        const prodSnap = await tx.get(prodRef);
        if (!prodSnap.exists()) {
          throw new Error(`Product ${item.productId} not found`);
        }
        const prodData = prodSnap.data();
        const available = prodData.stock ?? 0;
        if (available < item.quantity) {
          throw new Error(
            `Insufficient stock for ${prodData.name || item.productId}. Available ${available}, requested ${item.quantity}`
          );
        }
      }
  
      // 2) Decrement stock for each product
      for (const item of items) {
        const prodRef = doc(db, "products", item.productId);
        tx.update(prodRef, { stock: increment(-item.quantity) });
      }
  
      // 3) Create order doc (use transaction to set, so it's part of same atomic operation)
      const orderId = paymentInfo?.reference || `order_${Date.now()}`;
      const orderRef = doc(db, "orders", orderId);
      const orderData = {
        orderId,
        userId: userId || null,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name || null,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount,
        payment: {
          reference: paymentInfo?.reference || null,
          gateway_response: paymentInfo?.gateway_response || null,
          paid_at: paymentInfo?.paid_at || null,
          raw: paymentInfo || null,
        },
        status: "paid",
        createdAt: serverTimestamp(),
      };
  
      tx.set(orderRef, orderData);
  
      // 4) Optionally create a transactions collection record too
      if (paymentInfo?.reference) {
        const txRef = doc(db, "transactions", paymentInfo.reference);
        tx.set(txRef, {
          userId: userId || null,
          orderId,
          amount: totalAmount,
          reference: paymentInfo.reference,
          gateway_response: paymentInfo.gateway_response || null,
          paid_at: paymentInfo.paid_at || null,
          createdAt: serverTimestamp(),
          raw: paymentInfo,
        });
      }
  
      // commit => returning orderData as result (but serverTimestamp won't be resolved client-side)
      return { orderId, orderData };
    });
  }
  
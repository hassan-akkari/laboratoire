// MVP-ONLY — replace before going live with real users.
// In-memory order store on globalThis. Lost on every server restart.
// Conscious choice — see CLAUDE.md gotcha #6.
import { randomUUID } from "node:crypto";
import { quoteBooking } from "./pricing";
import type { CheckoutRequest } from "./bookingSchemas";

export type OrderRecord = {
  id: string;
  status: "confirmed";
  createdAt: string;
  idempotencyKey: string;
  customer: {
    fullName: string;
    email: string;
    paymentMethod: "card" | "wallet";
  };
  quote: ReturnType<typeof quoteBooking>;
};

type OrderStoreState = {
  orders: Map<string, OrderRecord>;
  idempotency: Map<string, string>;
};

const ORDER_TTL_MS = 6 * 60 * 60 * 1000;
const ORDER_STORE_LIMIT = 200;

const globalOrders = globalThis as typeof globalThis & {
  __bookingOrderStore__?: OrderStoreState;
};

function cleanupStore(store: OrderStoreState) {
  const expiryThreshold = Date.now() - ORDER_TTL_MS;

  for (const [orderId, order] of store.orders.entries()) {
    if (Date.parse(order.createdAt) < expiryThreshold) {
      store.orders.delete(orderId);
    }
  }

  for (const [idempotencyKey, orderId] of store.idempotency.entries()) {
    if (!store.orders.has(orderId)) {
      store.idempotency.delete(idempotencyKey);
    }
  }

  if (store.orders.size <= ORDER_STORE_LIMIT) {
    return;
  }

  const orderedEntries = [...store.orders.entries()].sort((a, b) => {
    return Date.parse(a[1].createdAt) - Date.parse(b[1].createdAt);
  });
  const overflowCount = store.orders.size - ORDER_STORE_LIMIT;

  for (const [orderId] of orderedEntries.slice(0, overflowCount)) {
    store.orders.delete(orderId);
  }

  for (const [idempotencyKey, orderId] of store.idempotency.entries()) {
    if (!store.orders.has(orderId)) {
      store.idempotency.delete(idempotencyKey);
    }
  }
}

function getOrderStore() {
  if (!globalOrders.__bookingOrderStore__) {
    globalOrders.__bookingOrderStore__ = {
      orders: new Map<string, OrderRecord>(),
      idempotency: new Map<string, string>(),
    };
  }

  cleanupStore(globalOrders.__bookingOrderStore__);
  return globalOrders.__bookingOrderStore__;
}

function createOrderId() {
  return `ord_${randomUUID()}`;
}

export function processCheckout(request: CheckoutRequest): OrderRecord {
  const store = getOrderStore();
  const existingOrderId = store.idempotency.get(request.idempotencyKey);

  if (existingOrderId) {
    const existingOrder = store.orders.get(existingOrderId);
    if (existingOrder) {
      return existingOrder;
    }
  }

  const quote = quoteBooking(request);
  const order: OrderRecord = {
    id: createOrderId(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    idempotencyKey: request.idempotencyKey,
    customer: {
      fullName: request.fullName,
      email: request.email,
      paymentMethod: request.paymentMethod,
    },
    quote,
  };

  store.orders.set(order.id, order);
  store.idempotency.set(request.idempotencyKey, order.id);
  return order;
}

export function getOrderById(orderId: string) {
  return getOrderStore().orders.get(orderId) ?? null;
}

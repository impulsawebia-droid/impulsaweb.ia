"use client";

import type { Order, Brief } from "./types";

const ORDERS_KEY = "impulsaweb_orders";
const BRIEFS_KEY = "impulsaweb_briefs";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((order) => order.id === id);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | undefined {
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
  return order;
}

export function getBriefs(): Brief[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(BRIEFS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getBriefByOrderId(orderId: string): Brief | undefined {
  const briefs = getBriefs();
  return briefs.find((brief) => brief.orderId === orderId);
}

export function saveBrief(brief: Brief): void {
  const briefs = getBriefs();
  const existingIndex = briefs.findIndex((b) => b.orderId === brief.orderId);
  if (existingIndex >= 0) {
    briefs[existingIndex] = brief;
  } else {
    briefs.push(brief);
  }
  localStorage.setItem(BRIEFS_KEY, JSON.stringify(briefs));

  // Mark order as brief completed
  const orders = getOrders();
  const order = orders.find((o) => o.id === brief.orderId);
  if (order) {
    order.briefCompleted = true;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

export function generateOrderId(): string {
  return `IW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

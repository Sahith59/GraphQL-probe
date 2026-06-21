export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
};

export type Order = {
  id: string;
  ownerId: string;
  status: "queued" | "paid" | "fulfilled" | "review";
  total: number;
  currency: "USD";
  placedAt: string;
  customerName: string;
  channel: "web" | "sales" | "partner";
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  privateNote: string;
};

export const users: User[] = [
  {
    id: "usr_101",
    email: "maya@bold.test",
    password: "demo1234",
    name: "Maya Chen",
    role: "Order Manager"
  },
  {
    id: "usr_202",
    email: "liam@bold.test",
    password: "demo1234",
    name: "Liam Brooks",
    role: "Finance Reviewer"
  },
  {
    id: "usr_303",
    email: "sofia@bold.test",
    password: "demo1234",
    name: "Sofia Rivera",
    role: "Support Lead"
  }
];

export const orders: Order[] = [
  {
    id: "4021",
    ownerId: "usr_101",
    status: "queued",
    total: 248.5,
    currency: "USD",
    placedAt: "2026-06-10T16:35:00.000Z",
    customerName: "Maya Chen",
    channel: "web",
    items: [
      { sku: "KIT-BOARD-7", name: "Launch room hardware kit", quantity: 1, unitPrice: 189 },
      { sku: "SUB-SUPPORT", name: "Priority support add-on", quantity: 1, unitPrice: 59.5 }
    ],
    privateNote: "Maya requested that budget metadata stay attached to the launch workflow."
  },
  {
    id: "8310",
    ownerId: "usr_202",
    status: "paid",
    total: 1299,
    currency: "USD",
    placedAt: "2026-06-12T10:12:00.000Z",
    customerName: "Liam Brooks",
    channel: "sales",
    items: [
      { sku: "ENT-SEATS-25", name: "Enterprise seat pack", quantity: 1, unitPrice: 999 },
      { sku: "MIGRATION", name: "Data migration block", quantity: 2, unitPrice: 150 }
    ],
    privateNote: "Procurement note includes renewal context. Real systems must scope this to the owner."
  },
  {
    id: "1168",
    ownerId: "usr_303",
    status: "review",
    total: 74.25,
    currency: "USD",
    placedAt: "2026-06-14T20:42:00.000Z",
    customerName: "Sofia Rivera",
    channel: "partner",
    items: [{ sku: "TEAM-TEMPLATE", name: "Team template bundle", quantity: 3, unitPrice: 24.75 }],
    privateNote: "Manual review pending after partner channel correction."
  }
];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function findOrderById(id: string) {
  return orders.find((order) => order.id === id);
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

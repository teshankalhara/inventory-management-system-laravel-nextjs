export const AUTH_ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  ME: "/me",
};

export const USER_ROUTES = {
  LIST: "/users",
  CREATE: "/users",
  UPDATE: (id: number) => `/users/${id}`,
  DELETE: (id: number) => `/users/${id}`,
};

export const PLACE_ROUTES = {
  LIST: "/places",
  CREATE: "/places",
  UPDATE: (id: number) => `/places/${id}`,
  DELETE: (id: number) => `/places/${id}`,
};

export const CUPBOARD_ROUTES = {
  LIST: "/cupboards",
  CREATE: "/cupboards",
  UPDATE: (id: number) => `/cupboards/${id}`,
  DELETE: (id: number) => `/cupboards/${id}`,
};

export const ITEM_ROUTES = {
  LIST: "/items",
  GET: (id: number) => `/items/${id}`,
  CREATE: "/items",
  UPDATE: (id: number) => `/items/${id}`,
  DELETE: (id: number) => `/items/${id}`,
};

export const BORROW_ROUTES = {
  LIST: "/borrow-records",
  BORROW: "/borrow",
  RETURN: (borrowId: number) => `/return/${borrowId}`,
};

export const ACTIVITY_LOG_ROUTES = {
  LIST: "/activity-logs",
};
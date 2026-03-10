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
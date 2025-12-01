export const ApiRoutes = {
  // LOGIN: {
  //   BASE: '/api/Login',
  //   SILENT_LOGIN: '/api/Login/SilentLogin',
  //   CHANGE_PASSWORD: '/api/Login/ChangePassword',
  //   REGISTER_EMPLOYEE: '/api/Login/Register/Employee',
  //   REGISTER_CUSTOMER: '/api/Login/Register/Customer',
  // },
  // CUSTOMERS: {
  //   BASE: '/api/Customer',
  //   CUSTOMER_ALL: '/api/Customer/All'
  // },
  // EMPLOYEE: {
  //  BASE: '/api/Employee',
  // GET: '/api/Employee/All',
  // GETBYID: (id: number) => `/api/Employee/${id}`

  // }
  LOGIN: {
    BASE: '/api/Login',
    SILENT_LOGIN: '/api/Login/SilentLogin',
    CHANGE_PASSWORD: '/api/Login/ChangePassword',
    REGISTER_EMPLOYEE: '/api/Login/Register/Employee',
    REGISTER_CUSTOMER: '/api/Login/Register/Customer',
  },
  CUSTOMERS: {
    BASE: '/api/Customer',
    CUSTOMER_ALL: '/api/Customer/All',
    GET_BY_ID: (id: number) => `/api/Customer/${id}`,
  },
  EMPLOYEE: {
    BASE: '/api/Employee',
    GET: '/api/Employee/All',
    GET_BY_ID: (id: number) => `/api/Employee/${id}`,
  },
  COLLECTION: {
    BASE: "/api/Collection",
    MENU: '/api/Collection/Menu',
    ALL: "/api/Collection/ALL",
    GET_COMBO: '/api/Collection/combo',
    GET_BY_ID: (id: number) => `/api/Collection/${id}`,
  },
  CART: {
    POST: '/api/Cart',
    GET: '/api/Cart',
    DELETE_ITEM_FROM_CART: (id: number) => `/api/Cart/${id}`,
    CHECKOUT: '/api/Cart/Checkout',
  },
  CATEGORY: {
    BASE: '/api/Category',
    GET: '/api/Category/All',
    GET_COMBO: '/api/Category/Combo',
    GET_BY_ID: (id: number) => `/api/Category/${id}`,
  },
  BANNER: {
    BASE: '/api/Banner',
    GET: '/api/Banner/All',
    GET_BY_ID: (id: number) => `/api/Banner/${id}`,
  },
  PRODUCT: {
    POST: '/api/product',
    ALL: '/api/product/All',
    GET_BY_ID: (productId: number) => `/api/Product/${productId}`,
    GET_COMBO: '/api/product/combo',
    MENU: '/api/Product/Menu',
    DASHBOARD: '/api/Product/Dashboard',
  },
  WISH: {
    GET: '/api/Wish',
    DELETE: (id: number) => `/api/Wish/${id}`,
    MENU: '/api/Product/Menu',
    DASHBOARD: '/api/Product/Dashboard',
  },
  ORDERS:{
    BASE:'/api/Order',
    ALL: '/api/Order/All',
    CHANGE_STATUS:'/api/Order/Status',
    GET_BY_ID: (id: number) => `/api/Order/${id}`,
  },
  DASHBOARD:{
    BASE:'/api/Dashboard',
  }
};

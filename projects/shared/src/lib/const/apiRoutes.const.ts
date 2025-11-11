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
    GETBYID: (id: number) => `/api/Customer/${id}`,
  },
  EMPLOYEE: {
    BASE: '/api/Employee',
    GET: '/api/Employee/All',
    GETBYID: (id: number) => `/api/Employee/${id}`,
  },
  CATEGORY: {
    BASE: '/api/Category',
    GET: '/api/Category/All',
    GET_COMBO: '/api/Category/Combo',
    GETBYID: (id: number) => `/api/Category/${id}`,
  },
  COLLECTION: {
    MENU: '/api/Collection/Menu',
  },
  BANNER: {
    BASE: '/api/Banner',
    GET: '/api/Banner/All',
    GETBYID: (id: number) => `/api/Banner/${id}`,
  },
  PRODUCT: {
    BASE: '/api/product',
    GET: '/api/product/All',
    GET_COMBO: '/api/product/combo',
    DASHBOARD: '/api/Product/Dashboard'
  },
  WISH: {
    GET: '/api/Wish',
    DELETE: (id: number) => `/api/Wish/${id}`,
  },
};

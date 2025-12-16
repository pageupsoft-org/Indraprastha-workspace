export const ApiRoutes = {
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
    SHIPPING_ADDRESS : '/api/Customer/ShippingAddress',
    GET_SHIPPING_ADDRESS : '/api/Customer/ShippingAddress',
    SHIPPIBG_DELETE_BY_ID: (id: number) => `/api/Customer/ShippingAddress/${id}`
  },
  EMPLOYEE: {
    BASE: '/api/Employee',
    GET: '/api/Employee/All',
    GET_BY_ID: (id: number) => `/api/Employee/${id}`,
  },
  COLLECTION: {
    BASE: '/api/Collection',
    MENU: '/api/Collection/Menu',
    ALL: '/api/Collection/ALL',
    GET_COMBO: '/api/Collection/combo',
    GET_BY_ID: (id: number) => `/api/Collection/${id}`,
    GET_BY_GENDER: (gender: string) => `/api/Collection/Menu/${gender}`,
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
    DETAIL_INFO: '/api/product/Info',
    ALL: '/api/product/All',
    GET_BY_ID: (productId: number) => `/api/Product/${productId}`,
    GET_COMBO: '/api/product/combo',
    MENU: '/api/Product/Menu',
    DASHBOARD: '/api/Product/Dashboard',
    CART: '/api/Product/Cart',
  },
  WISH: {
    GET: '/api/Wish',
    ADD: '/api/Wish',
    DELETE: (id: number) => `/api/Wish/${id}`,
    MENU: '/api/Product/Menu',
    DASHBOARD: '/api/Product/Dashboard',
  },
  ORDERS: {
    BASE: '/api/Order',
    ALL: '/api/Order/All',
    CHANGE_STATUS: '/api/Order/Status',
    GET_BY_ID: (id: number) => `/api/Order/${id}`,
    GET_BY_GUID: (GUID: string) => `/api/Order/${GUID}`,
    MY_ORDERS: '/api/Order/Customer'
  },
  DASHBOARD: {
    BASE: '/api/Dashboard',
  },
  ABOUT:{
   GET:'/api/About'
  },
  PROFILE:{
    BASE:'/api/Profile',
    GET_BY_ID: (id:number) => `/api/Profile/${id}`
  },
  
};

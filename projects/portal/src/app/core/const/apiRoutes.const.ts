export const apiRoutes = {
  LOGIN: {
    BASE: '/api/Login',
    SILENT_LOGIN: '/api/Login/SilentLogin',
    CHANGE_PASSWORD: '/api/Login/ChangePassword',
    REGISTER_EMPLOYEE: '/api/Login/Register/Employee',
    REGISTER_CUSTOMER: '/api/Login/Register/Customer',
  },
  CUSTOMERS: {
    BASE: '/api/Customer',
    CUSTOMER_ALL: '/api/Customer/All'
  },
  EMPLOYEE: {
   BASE: '/api/Employee',
  //  GET_EMPLOYEE: '/api/Employee/'
  GET: '/api/Employee/All',
  GETBYID: (id: number) => `/api/Employee/${id}`
  
  }
};



export * from './base/base';

//#region Const
export * from './const/apiRoutes.const';
export * from './const/appRoutes.const';
//#endregion

export * from './directive/validation';


//#region Enum
export * from './enum/localStorage.enum';
export * from './enum/toast-type.enum';
export * from './enum/variable.enum';
//#endregion


//#endregion Environment
// export * from './environment/dev.env';
//#endregion Environment

//#region Interceptor
export * from './interceptor/auth-interceptor';
export * from './interceptor/loader-interceptor';
//#endregion Interceptor

//#region Interface
    //#region Model
// export * from './interface/model/confirmation.model';
// export * from './interface/model/pagination-detail.model';
// export * from './interface/model/toast.model';
// export * from './interface/model/utility.model';
    //#endregion

    //#region Response
// export * from './interface/response/customer';
// export * from './interface/response/employee';
// export * from './interface/response/login.response';
// export * from './interface/response/responseGeneric';
    //#endregion

    //#region Request
// export * from './interface/request/customer';
// export * from './interface/request/employee';
    //#endregion
//#endregion

//#region Layout
export * from './layout/main-layout/main-layout';
//#endregion Layout

//#region Service
export * from './services/loader-service';
export * from './services/toast-service';
//#endregion Service

//#region Utility
export * from './utils/api.helper';
export * from './utils/confimation.util';
export * from './utils/pagination.util';
export * from './utils/utility.util';
//#endregion
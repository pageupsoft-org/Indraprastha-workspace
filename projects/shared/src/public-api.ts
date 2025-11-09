/*
 * Public API Surface of shared
 */
export * from './core/component/toast/toast';
export * from './core/const/apiRoutes.const';
export * from './core/directive/error-handler';

export * from './core/enum/toast-type.enum';
export * from './core/enum/variable.enum';

export * from './core/environments/dev.env';

export * from './core/interface/model/header.model';
export * from './core/interface/model/login.model';
export * from './core/interface/model/register.model';
// export * from './core/interface/model/toast.model';

export * from './core/interface/response/generic.response';
export * from './core/interface/response/login.response';
export * from './core/interface/response/newArrival.response';
export * from './core/interface/response/product-detail.response';
export * from './core/interface/response/shopping-cart.response';
export * from './core/interface/response/wishlist.response';

export * from './core/services/firebase-service';
export * from './core/services/platform-service';
export * from './core/services/toast-service';

export * from './core/utils/api.helper';
export * from './core/utils/pattern-message.util';

export * from './lib/shared';

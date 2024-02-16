"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrors = exports.UserErrors = void 0;
var UserErrors;
(function (UserErrors) {
    UserErrors["NO_USER_FOUND"] = "no-user-found";
    UserErrors["WRONG_CREDENTIALS"] = "wrong-credentials";
    UserErrors["USERNMAE_ALREADY_EXISTS"] = "username-alreafy-exists";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
var ProductErrors;
(function (ProductErrors) {
    ProductErrors["NO_USER_FOUND"] = "no-user-found";
    ProductErrors["NO_PRODUCT_FOUND"] = "no-product-found";
    ProductErrors["NO_AVAILABLE_MONEY"] = "no-available-money";
    ProductErrors["NOT_ENOUGH_STOCK"] = "not-enough-stock";
})(ProductErrors || (exports.ProductErrors = ProductErrors = {}));

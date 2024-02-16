"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const products_1 = require("../models/products");
const user_1 = require("./user");
const user_2 = require("../models/user");
const errors_1 = require("../errors");
const router = (0, express_1.Router)();
exports.productRouter = router;
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_1.ProductModel.find({});
        res.json(products);
        console.log(111);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
router.post('/checkout', user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { customerID, cartItems } = req.body;
    try {
        const user = yield user_2.UserModel.findById(customerID);
        const productIDs = Object.keys(cartItems);
        const products = yield products_1.ProductModel.find({ _id: { $in: productIDs } });
        if (!user) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_USER_FOUND });
        }
        if (products.length !== productIDs.length) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCT_FOUND });
        }
        let totalprice = 0;
        for (const item in cartItems) {
            const product = products.find((product) => String(product._id) === item);
            if (!product) {
                return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCT_FOUND });
            }
            if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: errors_1.ProductErrors.NOT_ENOUGH_STOCK });
            }
            totalprice = totalprice + product.price * cartItems[item];
        }
        if (user.availableMoney < totalprice) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_AVAILABLE_MONEY });
        }
        user.availableMoney = user.availableMoney - totalprice;
        user.purchasedItems.push(...productIDs);
        yield user.save();
        yield products_1.ProductModel.updateMany({ _id: { $in: productIDs } }, { $inc: { stockQuantity: -1 } });
        res.json({ purchasedItems: user.purchasedItems });
    }
    catch (err) {
        console.log(err);
    }
}));
router.get('/purchased-items/:customerID', user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID } = req.params;
    try {
        const user = yield user_2.UserModel.findById(customerID);
        if (!user) {
            res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
        }
        const products = yield products_1.ProductModel.find({ _id: { $in: user.purchasedItems } });
        res.json({ purchasedItems: products });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controller/controllers");
exports.signUpRouter = express_1.default.Router();
/* GET signUp form page. */
exports.signUpRouter.get('/', controllers_1.signupGetHandler);
/* POST signUp form page. */
exports.signUpRouter.post('/', controllers_1.signupPostHandler);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controller/controllers");
exports.loginRouter = express_1.default.Router();
/* GET login form page. */
exports.loginRouter.get('/', controllers_1.loginGetHandler);
/* POST login form page */
exports.loginRouter.post('/', controllers_1.loginPostHandler);

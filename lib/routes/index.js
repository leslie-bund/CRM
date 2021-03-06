"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controller/controllers");
exports.indexRouter = express_1.default.Router();
/* GET home page. */
exports.indexRouter.get('/', controllers_1.landingPageHandler);
